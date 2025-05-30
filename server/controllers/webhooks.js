// // import { Webhook } from "svix";
// // import User from "../models/User.js";
// // import stripe from "stripe";
// // import { Purchase } from "../models/Purchase.js";
// // import Course from "../models/Course.js";



// // // API Controller Function to Manage Clerk User with database
// // export const clerkWebhooks = async (req, res) => {
// //   try {

// //     // Create a Svix instance with clerk webhook secret.
// //     const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

// //     // Verifying Headers
// //     await whook.verify(JSON.stringify(req.body), {
// //       "svix-id": req.headers["svix-id"],
// //       "svix-timestamp": req.headers["svix-timestamp"],
// //       "svix-signature": req.headers["svix-signature"]
// //     })

// //     // Getting Data from request body
// //     const { data, type } = req.body

// //     // Switch Cases for differernt Events
// //     switch (type) {
// //       case 'user.created': {

// //         const userData = {
// //           _id: data.id,
// //           email: data.email_addresses[0].email_address,
// //           name: data.first_name + " " + data.last_name,
// //           imageUrl: data.image_url,
// //           resume: ''
// //         }
// //         await User.create(userData)
// //         res.json({})
// //         break;
// //       }

// //       case 'user.updated': {
// //         const userData = {
// //           email: data.email_addresses[0].email_address,
// //           name: data.first_name + " " + data.last_name,
// //           imageUrl: data.image_url,
// //         }
// //         await User.findByIdAndUpdate(data.id, userData)
// //         res.json({})
// //         break;
// //       }

// //       case 'user.deleted': {
// //         await User.findByIdAndDelete(data.id)
// //         res.json({})
// //         break;
// //       }
// //       default:
// //         break;
// //     }

// //   } catch (error) {
// //     res.json({ success: false, message: error.message })
// //   }
// // }


// // // Stripe Gateway Initialize
// // const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)


// // // Stripe Webhooks to Manage Payments Action
// // export const stripeWebhooks = async (request, response) => {
// //   const sig = request.headers['stripe-signature'];

// //   let event;

// //   try {
// //     event = stripeInstance.webhooks.constructEvent(request.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
// //   }
// //   catch (err) {
// //     response.status(400).send(`Webhook Error: ${err.message}`);
// //   }

// //   // Handle the event
// //   switch (event.type) {
// //     case 'payment_intent.succeeded': {

// //       const paymentIntent = event.data.object;
// //       const paymentIntentId = paymentIntent.id;

// //       // Getting Session Metadata
// //       const session = await stripeInstance.checkout.sessions.list({
// //         payment_intent: paymentIntentId,
// //       });

// //       const { purchaseId } = session.data[0].metadata;

// //       const purchaseData = await Purchase.findById(purchaseId)
// //       const userData = await User.findById(purchaseData.userId)
// //       const courseData = await Course.findById(purchaseData.courseId.toString())

// //       courseData.enrolledStudents.push(userData)
// //       await courseData.save()

// //       userData.enrolledCourses.push(courseData._id)
// //       await userData.save()

// //       purchaseData.status = 'completed'
// //       await purchaseData.save()

// //       break;
// //     }
// //     case 'payment_intent.payment_failed': {
// //       const paymentIntent = event.data.object;
// //       const paymentIntentId = paymentIntent.id;

// //       // Getting Session Metadata
// //       const session = await stripeInstance.checkout.sessions.list({
// //         payment_intent: paymentIntentId,
// //       });

// //       const { purchaseId } = session.data[0].metadata;

// //       const purchaseData = await Purchase.findById(purchaseId)
// //       purchaseData.status = 'failed'
// //       await purchaseData.save()

// //       break;
// //     }
// //     default:
// //       console.log(`Unhandled event type ${event.type}`);
// //   }

// //   // Return a response to acknowledge receipt of the event
// //   response.json({ received: true });
// // }

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
//     console.log("🚀 Clerk Webhook Received:", new Date().toISOString());
//     if (!req.headers["svix-id"]) {
//       console.log("⚠️ No svix headers detected, skipping verification (Postman Test Mode)");
//     } else {
//        console.log("🧾 Svix Headers found. Verifying signature...");
//       const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
//       await whook.verify(JSON.stringify(req.body), {
//         "svix-id": req.headers["svix-id"],
//         "svix-timestamp": req.headers["svix-timestamp"],
//         "svix-signature": req.headers["svix-signature"],
//       });
//       console.log("✅ Webhook signature verified successfully.");
//     }

//     const { data, type } = req.body;
//     console.log("📦 Webhook Type:", type);
//     console.log("📄 Incoming User Data:", JSON.stringify(data, null, 2));
//     switch (type) {
//       case "user.created": {
//         console.log('👤 New user created webhook received');
//         const userData = {
//           _id: data.id,
//           email: data.email_addresses[0].email_address,
//           name: `${data.first_name || "Unknown"} ${data.last_name || ""}`.trim(),
//           imageUrl: data.image_url,
//         };

//         try {
//           const user = await User.create(userData);
//           console.log('✅ User saved to MongoDB:', userData);
//         } catch (error) {
//           console.error("❌ MongoDB Insertion Error:", error.message);
//         }

//         res.json({});
//         break;
//       }
// // API Controller Function to Manage Clerk User with database
// // export const clerkWebhooks = async (req, res) => {
// //   try {

//     // Create a Svix instance with clerk webhook secret.
//     // const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET)

//     // Verifying Headers
//     // await whook.verify(JSON.stringify(req.body), {
//     //   "svix-id": req.headers["svix-id"],
//     //   "svix-timestamp": req.headers["svix-timestamp"],
//     //   "svix-signature": req.headers["svix-signature"]
//     // })

//     // // Getting Data from request body
//     // const { data, type } = req.body

//     // // Switch Cases for differernt Events
//     // switch (type) {
//     //   case 'user.created': {
//     //     console.log('👤 New user created webhook received');
//     //     const userData = {
//     //       _id: data.id,
//     //       email: data.email_addresses[0].email_address,
//     //       name: data.first_name + " " + data.last_name,
//     //       imageUrl: data.image_url,
//     //       resume: ''
//     //     }
//     //     await User.create(userData);
//     //     console.log('✅ User saved to MongoDB:', userData);
//     //     res.json({})
//     //     break;
//     //   }

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

//UPDATED CODE
import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from "stripe";
import { Purchase } from "../models/Purchase.js";
import Course from "../models/Course.js";

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

// ✅ Clerk Webhook
export const clerkWebhooks = async (req, res) => {
  try {
    if (req.headers["svix-id"]) {
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
          name: `${data.first_name || "Unknown"} ${data.last_name || ""}`.trim(),
          imageUrl: data.image_url,
        };
        await User.create(userData);
        res.json({});
        break;
      }
      case "user.updated": {
        await User.findByIdAndUpdate(data.id, {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        });
        res.json({});
        break;
      }
      case "user.deleted": {
        await User.findByIdAndDelete(data.id);
        res.json({});
        break;
      }
      default:
        res.json({});
        break;
    }
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// ✅ Utility to get Stripe Session from Payment Intent
const getStripeSessionFromIntent = async (paymentIntentId) => {
  const sessionList = await stripeInstance.checkout.sessions.list({
    payment_intent: paymentIntentId,
  });
  if (!sessionList.data.length) {
    throw new Error("No session found for payment intent");
  }
  return sessionList.data[0];
};

// // ✅ Stripe Webhook
// export const stripeWebhooks = async (req, res) => {
//   const sig = req.headers["stripe-signature"];
//   let event;

//   try {
//     event = stripeInstance.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   try {
//     switch (event.type) {
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object;
//         const session = await getStripeSessionFromIntent(paymentIntent.id);
//         const { purchaseId } = session.metadata || {};

//         if (!purchaseId) throw new Error("Missing purchaseId in metadata");

//         const purchaseData = await Purchase.findById(purchaseId);
//         if (!purchaseData) throw new Error("Purchase not found");

//         const userData = await User.findById(purchaseData.userId);
//         if (!userData) throw new Error("User not found");

//         const courseData = await Course.findById(purchaseData.courseId);
//         if (!courseData) throw new Error("Course not found");

//         courseData.enrolledStudents.push(userData._id);
//         await courseData.save();

//         userData.enrolledCourses.push(courseData._id);
//         await userData.save();

//         purchaseData.status = "completed";
//         await purchaseData.save();
//         break;
//       }

//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object;
//         const session = await getStripeSessionFromIntent(paymentIntent.id);
//         const { purchaseId } = session.metadata || {};

//         if (purchaseId) {
//           const purchaseData = await Purchase.findById(purchaseId);
//           if (purchaseData) {
//             purchaseData.status = "failed";
//             await purchaseData.save();
//           }
//         }
//         break;
//       }

//       default:
//         break;
//     }

//     res.json({ received: true });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

export const stripeWebhooks = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;
  // const event = req.body;

   if (process.env.NODE_ENV === "development") {
    event = req.body;
  } else {
    const sig = req.headers["stripe-signature"];
  }
  // Step 1: Verify raw body and signature
  try {
    event = stripeInstance.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    // console.log("✅ Stripe event verified:", event.type);
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Step 2: Handle events
//   try {
//     switch (event.type) {
//       case "payment_intent.succeeded": {
//         const paymentIntent = event.data.object;
//         // console.log("💰 PaymentIntent Succeeded:", paymentIntent.id);
//         //  console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);

//         const session = await getStripeSessionFromIntent(paymentIntent.id);
//         // if (!session) throw new Error("Session not found from intent");

//         const { purchaseId } = session.metadata || {};
//         if (!purchaseId) throw new Error("Missing purchaseId in session metadata");

//         const purchase = await Purchase.findById(purchaseId);
//         if (!purchase) throw new Error("Purchase record not found");

//         const user = await User.findById(purchase.userId);
//         if (!user) throw new Error("User not found");

//         const course = await Course.findById(purchase.courseId);
//         if (!course) throw new Error("Course not found");

//         // Enroll user
//         course.enrolledStudents.push(user._id);
//         await course.save();

//         user.enrolledCourses.push(course._id);
//         await user.save();

//         purchase.status = "completed";
//         await purchase.save();

//         console.log("✅ Purchase marked complete:", purchaseId);
//         break;
//       }

//       case "payment_intent.payment_failed": {
//         const paymentIntent = event.data.object;
//         console.log("⚠️ PaymentIntent Failed:", paymentIntent.id);

//         const session = await getStripeSessionFromIntent(paymentIntent.id);
//         const { purchaseId } = session.metadata || {};

//         if (purchaseId) {
//           const purchase = await Purchase.findById(purchaseId);
//           if (purchase) {
//             purchase.status = "failed";
//             await purchase.save();
//             console.log("❌ Purchase marked failed:", purchaseId);
//           }
//         }
//         break;
//       }

//       default:
//         console.log("ℹ️ Unhandled event type:", event.type);
//         break;
//     }

//     return res.json({ received: true });
//   } catch (error) {
//     console.error("🚨 Error in webhook handling:", error.message);
//     return res.status(500).json({ success: false, message: error.message });
//   }
// };
try {
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const session = await getStripeSessionFromIntent(paymentIntent.id);
        const { purchaseId } = session.metadata || {};

        if (!purchaseId) throw new Error("Missing purchaseId in metadata");

        const purchaseData = await Purchase.findById(purchaseId);
        if (!purchaseData) throw new Error("Purchase not found");

        const userData = await User.findById(purchaseData.userId);
        if (!userData) throw new Error("User not found");

        const courseData = await Course.findById(purchaseData.courseId);
        if (!courseData) throw new Error("Course not found");

        courseData.enrolledStudents.push(userData._id);
        await courseData.save();

        userData.enrolledCourses.push(courseData._id);
        await userData.save();

        purchaseData.status = "completed";
        await purchaseData.save();
        break;
      }

      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object;
        const session = await getStripeSessionFromIntent(paymentIntent.id);
        const { purchaseId } = session.metadata || {};

        if (purchaseId) {
          const purchaseData = await Purchase.findById(purchaseId);
          if (purchaseData) {
            purchaseData.status = "failed";
            await purchaseData.save();
          }
        }
        break;
      }

      default:
          console.log(`Unhandled event type: ${event.type}`);
        // break;
    }

    res.json({ received: true });
  } catch (error) {
     console.error("Webhook processing error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
