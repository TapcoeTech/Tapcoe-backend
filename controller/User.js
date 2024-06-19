
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
import Eventreq from "../models/Eventrequest.js";
import Event from "../models/Events.js";
import User from "../models/User.js";




// Controller function to host an event
export const hostEvent = async (req, res) => {
  const { eventName, description, startDate, endDate, location, email } = req.body;

  try {
    // Find the user by email in the database
    const hostUser = await User.findOne({ email });

    if (!hostUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create the event with hostUser as the host
    const newEvent = new Event({
      eventName,
      description,
      startDate,
      endDate,
      location,
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




// Controller function to save event request data
export const saveEventRequest = async (req, res) => {
    const { name, email, phone, company, designation, event } = req.body;

    try {
        // Create a new NaveEventreq document
        const newEventRequest = new Eventreq({
            name,
            email,
            phone,
            company,
            designation,
            event
        });

        // Save the document to the database
        await newEventRequest.save();

        res.status(200).json({
            status: true,
            message: "Request received successfully"
        });
         // Respond with the saved document
    } catch (error) {
        res.status(500).json({ message: 'Failed to save event request', error: error.message });
    }
};

