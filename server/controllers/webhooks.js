import { Webhook } from "svix";
import User from "../models/User.js";
import stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";



// API Controller Function to Manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {

    // Create a Svix instance with clerk webhook secret.
    const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

    // Verifying Headers
    await whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"]
    })

    // Getting Data from request body
    const { data, type } = req.body

    // Switch Cases for differernt Events
    switch (type) {
      case 'user.created': {

        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
          resume: ''
        }
        await User.create(userData)
        res.json({})
        break;
      }

      case 'user.updated': {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: data.first_name + " " + data.last_name,
          imageUrl: data.image_url,
        }
        await User.findByIdAndUpdate(data.id, userData)
        res.json({})
        break;
      }

      case 'user.deleted': {
        await User.findByIdAndDelete(data.id)
        res.json({})
        break;
      }
      default:
        break;
    }

  } catch (error) {
    res.json({ success: false, message: error.message })
  }
}


// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// Stripe Webhooks to Manage Payments Action
export const stripeWebhooks = async (request, response) => {
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }
  catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded': {

      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      const userData = await User.findById(purchaseData.userId)
      const courseData = await Course.findById(purchaseData.courseId.toString())

      courseData.enrolledStudents.push(userData)
      await courseData.save()

      userData.enrolledCourses.push(courseData._id)
      await userData.save()

      purchaseData.status = 'completed'
      await purchaseData.save()

      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const paymentIntentId = paymentIntent.id;

      // Getting Session Metadata
      const session = await stripeInstance.checkout.sessions.list({
        payment_intent: paymentIntentId,
      });

      const { purchaseId } = session.data[0].metadata;

      const purchaseData = await Purchase.findById(purchaseId)
      purchaseData.status = 'failed'
      await purchaseData.save()

      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  response.json({ received: true });
}

// import { Webhook } from "svix";
// import User from "../models/User.js";
// import Stripe from "stripe";
// import { Purchase } from "../models/Purchase.js";
// import Course from "../models/Course.js";

// // Initialize Stripe with the correct secret key
// const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// // ✅ Clerk Webhook (No Changes Here)
// export const clerkWebhooks = async (req, res) => {
//   try {
//     if (!req.headers["svix-id"]) {
//       console.log("⚠️ No svix headers detected, skipping verification (Postman Test Mode)");
//     } else {
//       const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//       await whook.verify(JSON.stringify(req.body), {
//         "svix-id": req.headers["svix-id"],
//         "svix-timestamp": req.headers["svix-timestamp"],
//         "svix-signature": req.headers["svix-signature"],
//       });
//     }

//     const { data, type } = req.body;
//     switch (type) {
//       case "user.created": {
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name} ${data.last_name}`,
//           imageUrl: data.image_url,
//         };

//         try {
//           const user = await User.create(userData);
//           console.log("✅ User Saved Successfully:", user);
//         } catch (error) {
//           console.error("❌ MongoDB Insertion Error:", error.message);
//         }

//         res.json({});
//         break;
//       }

//       case "user.updated":
//         await User.findByIdAndUpdate(data.id, {
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name} ${data.last_name}`,
//           imageUrl: data.image_url,
//         });
//         res.json({});
//         break;

//       case "user.deleted":
//         await User.findByIdAndDelete(data.id);
//         res.json({});
//         break;

//       default:
//         break;
//     }
//   } catch (error) {
//     res.json({ success: false, message: error.message });
//   }
// };

// // ✅ Stripe Webhook with Debugging Logs
// export const stripeWebhooks = async (request, response) => {
//   const sig = request.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       request.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//     console.log(`📌 Received Stripe Event: ${event.type}`);
//     console.log("📌 Full Event Data:", JSON.stringify(event, null, 2)); // Log full event for debugging
//   } catch (err) {
//     console.error("❌ Webhook Signature Verification Failed:", err.message);
//     return response.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   switch (event.type) {
//     case "payment_intent.succeeded": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id; // ✅ Fixed typo
//       console.log(`📌 Payment Intent ID: ${paymentIntentId}`);

//       try {
//         // Fetch session details from Stripe
//         const session = await stripeInstance.checkout.sessions.list({
//           payment_intent: paymentIntentId,
//         });

//         if (!session.data.length) {
//           console.error("❌ No session found for this payment intent.");
//           break;
//         }

//         console.log("✅ Stripe Session Data:", session.data[0]);

//         // Retrieve purchaseId from metadata
//         const { purchaseId } = session.data[0].metadata || {};
//         if (!purchaseId) {
//           console.error("❌ No purchaseId found in metadata.");
//           break;
//         }
//         console.log(`📌 Retrieved Purchase ID: ${purchaseId}`);

//         // Fetch purchase data from MongoDB
//         const purchaseData = await Purchase.findById(purchaseId);
//         if (!purchaseData) {
//           console.error("❌ Purchase not found in database.");
//           break;
//         }
//         console.log(`✅ Found Purchase in DB: ${purchaseData._id}`);

//         // Fetch user and course data
//         const userData = await User.findById(purchaseData.userId);
//         if (!userData) {
//           console.error("❌ User not found in database.");
//           break;
//         }
//         console.log(`✅ Found User in DB: ${userData._id}`);

//         const courseData = await Course.findById(purchaseData.courseId.toString());
//         if (!courseData) {
//           console.error("❌ Course not found in database.");
//           break;
//         }
//         console.log(`✅ Found Course in DB: ${courseData._id}`);

//         // Enroll user in course
//         courseData.enrolledStudents.push(userData._id);
//         await courseData.save();
//         console.log("✅ User successfully enrolled in course.");

//         userData.enrolledCourses.push(courseData._id);
//         await userData.save();
//         console.log("✅ User's enrolled courses updated.");

//         // Update purchase status in MongoDB
//         purchaseData.status = "completed";
//         await purchaseData.save();
//         console.log("✅ Purchase status updated to 'completed'.");
//       } catch (error) {
//         console.error("⚠️ Error processing payment_intent.succeeded:", error.message);
//       }
//       break;
//     }

//     case "payment_intent.payment_failed": {
//       const paymentIntent = event.data.object;
//       const paymentIntentId = paymentIntent.id;
//       console.log(`📌 Payment Intent Failed: ${paymentIntentId}`);

//       try {
//         const session = await stripeInstance.checkout.sessions.list({
//           payment_intent: paymentIntentId,
//         });

//         const { purchaseId } = session.data[0].metadata || {};
//         if (!purchaseId) {
//           console.error("❌ No purchaseId found in metadata.");
//           break;
//         }

//         const purchaseData = await Purchase.findById(purchaseId);
//         if (purchaseData) {
//           purchaseData.status = "failed";
//           await purchaseData.save();
//           console.log(`❌ Purchase status updated to 'failed' for: ${purchaseId}`);
//         }
//       } catch (error) {
//         console.error("⚠️ Error processing payment_intent.payment_failed:", error.message);
//       }
//       break;
//     }

//     default:
//       console.log(`⚠️ Unhandled event type ${event.type}`);
//   }

//   response.json({ received: true });
// };
