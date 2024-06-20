
// export const createUser= async()=> {
//     try {
//         const user = new User({
//             name: 'John Doe',
//             email: 'john.doe@example.com',
//             phone: '1234567890'
//         });
//         await user.save();
//         console.log('User created:', user);
//     } catch (error) {
//         console.error('Error creating user:', error);
//     }
// }
// Adjust the import path as per your project structure


import Event from "../models/Events.js";
import User from "../models/User.js";





// Controller function to host an event
export const hostEvent = async (req, res) => {
  const { description,eventType,designation,name,phone, email  } = req.body;

  try {
    // Find the user by email in the database
    const hostUser = await User.findOne({ email });

    if (!hostUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the event with hostUser as the host
    const newEvent = new Event({
        eventType,
      designation,
      name,
      phone,
      
      description,
      host: hostUser._id, // Assign host as ObjectId of hostUser
      participants: [], // Initialize with empty participants array
      likes: [] // Initialize with empty likes array
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json(newEvent); // Respond with the created event
  } catch (error) {
    res.status(500).json({ message: 'Event creation failed', error: error.message });
  }
};






// export const saveEventRequest = async (req, res) => {
//     const { name, email, phone, company, designation, event } = req.body;

//     try {
//         // Validate required fields (example: email is required)
//         if (!email || !name || !event) {
//             return res.status(400).json({ message: 'Name, Email, and Event are required' });
//         }

//         // Create a new event request object
//         const newEventRequest = {
//             name,
//             email,
//             phone,
//             company,
//             designation,
//             event
//         };

//         // Directly push the new event request into Eventreq collection
//         const result = await Eventreq.updateOne(
//             {}, // Update all documents (you can specify a specific filter if needed)
//             { $push: { 'eventRequests': newEventRequest } },
//             { upsert: true, runValidators: true }
//         );

//         // Check result and handle success/failure
//         if (result.ok) {
//             // Respond with success message and data
//             res.status(200).json({
//                 status: true,
//                 message: "Event request saved successfully",
//                 data: newEventRequest
//             });
//         } else {
//             throw new Error('Failed to save event request');
//         }
//     } catch (error) {
//         console.error('Error saving event request:', error);

//         // Handle any specific errors
//         res.status(500).json({ message: 'Failed to save event request', error: error.message });
//     }
// };


