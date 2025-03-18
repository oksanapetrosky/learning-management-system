import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

//API Controller Function to manage Clerk User with Database

export const clerkWebhooks = async (req, res) => {
  try {
    // const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    // await whook.verify(JSON.stringify(req.body), {
    //   "svix-id": req.headers["svix-id"],
    //   "svix-timestamp": req.headers["svix-timestamp"],
    //   "svix-signature": req.headers["svix-signature"],
    // });

    if (!req.headers["svix-id"]) {
      console.log(
        "⚠️ No svix headers detected, skipping verification (Postman Test Mode)"
      );
    } else {
      const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);

      await whook.verify(JSON.stringify(req.body), {
        "svix-id": req.headers["svix-id"],
        "svix-timestamp": req.headers["svix-timestamp"],
        "svix-signature": req.headers["svix-signature"],
      });
    }

    const { data, type } = req.body;
    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        // await User.create(userData);
        try {
          const user = await User.create(userData);
          console.log("User Saved Successfully:", user);
        } catch (error) {
          console.error("MongoDB Insertion Error:", error.message);
        }

        res.json({});
        break;
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        };
        await User.findByIdAndUpdate(data.id, userData);
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        break;
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// after we added secret_stripe_webhook in .env file - we add here from the docs.stripe.com/webhooks
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const strikeWebhooks = async (request, response) => {
  const sig = request.headers["stripe-signature"]; // ✅ Fixed: Changed 'req' to 'request'

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent( // ✅ Fixed: Changed 'Stripe.webhooks' to 'stripeInstance.webhooks'
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return response.status(400).send(`Webhook Error: ${err.message}`); // ✅ Fixed: Added return
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded": {
      const paymentIntent = event.data.object;
      const paymentIntendId = paymentIntent.id;

      try {
        const session = await stripeInstance.checkout.sessions.list({ // ✅ Fixed: Added 'await'
          payment_intent: paymentIntendId,
        });

        const { purchaseId } = session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        const userData = await User.findById(purchaseData.userId);
        const courseData = await Course.findById(purchaseData.courseId.toString());

        if (courseData && userData) {
          courseData.enrolledStudents.push(userData);
          await courseData.save();
          
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();
      } catch (error) {
        console.error("Error processing payment_intent.succeeded:", error.message);
      }
      break;
    }

    case "payment_intent.payment_failed": {
      const paymentIntent = event.data.object;
      const paymentIntendId = paymentIntent.id;

      try {
        const session = await stripeInstance.checkout.sessions.list({ // ✅ Fixed: Added 'await'
          payment_intent: paymentIntendId,
        });

        const { purchaseId } = session.data[0].metadata;
        const purchaseData = await Purchase.findById(purchaseId);
        
        if (purchaseData) {
          purchaseData.status = "failed";
          await purchaseData.save();
        }
      } catch (error) {
        console.error("Error processing payment_intent.payment_failed:", error.message);
      }
      break;
    }

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
};
