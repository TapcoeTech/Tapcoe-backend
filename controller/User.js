
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
      // Initialize with empty likes array
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json(newEvent); // Respond with the created event
  } catch (error) {
    res.status(500).json({ message: 'Event creation failed', error: error.message });
  }
};

export const liveEvent = async (req, res) => {
    const { eventName, startDate, endDate, email, event_id, eventImage } = req.body;

    try {
        // Find the user by email
        const hostUser = await User.findOne({ email });

        if (!hostUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Find the event by ID and verify that the host user matches
        const event = await Event.findOne({ _id: event_id, host: hostUser._id });

        if (!event) {
            return res.status(404).json({ message: 'Event not found or user is not the host' });
        }

        // Update the event details
        if (eventName) event.eventName = eventName;
        if (startDate) event.startDate = startDate;
        if (endDate) event.endDate = endDate;
        if (eventImage) event.eventImage = eventImage;

        // Save the updated event
        const updatedEvent = await event.save();

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Event update failed', error: error.message });
    }
};


export const addParticipantWithImageUrl = async (req, res) => {
    const { eventName, email, profileImgUrl,uuid } = req.body;

    try {
        // Find the event by name
        const event = await Event.findOne({ eventName });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find the user by email
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the user is already a participant
        const isAlreadyParticipant = event.participants.some(participant => participant.user.equals(user._id));
        if (isAlreadyParticipant) {
            return res.status(400).json({ message: 'User is already a participant' });
        }

        // Add user to participants with image URL
        event.participants.push({ user: user._id, image: {
            imageUrl:profileImgUrl,
            uuid:uuid
        } });

        // Save the updated event
        await event.save();

        res.status(200).json({ message: 'Participant added successfully', event });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// export const likeEvent = async (req, res) => {
//     const { likerEmail, event_id, participant_id } = req.body;

//     try {
//         // Find the user who is liking the event
//         const likerUser = await User.findOne({ email: likerEmail });
        
//         if (!likerUser) {
//             return res.status(404).json({ message: 'Liker user not found' });
//         }

//         // Find the event by event_id
//         const event = await Event.findById(event_id);

//         if (!event) {
//             return res.status(404).json({ message: 'Event not found' });
//         }

//         // Add the participant_id to the likes array if not already liked
//         if (!event.likes.includes(participant_id)) {
//             event.likes.push(participant_id);
//         } else {
//             return res.status(400).json({ message: 'User already liked this event' });
//         }

//         // Save the updated event
//         await event.save();

//         res.status(200).json({ message: 'Event liked successfully', event });
//     } catch (error) {
//         console.error('Error liking event:', error);
//         res.status(500).json({ message: 'Server error', error: error.message });
//     }
// };


export const likeEvent = async (req, res) => {
    const { likerEmail, event_id, participant_id } = req.body;

    try {
        // Find the user who is liking the event
        const likerUser = await User.findOne({ email: likerEmail });
        
        if (!likerUser) {
            return res.status(404).json({ message: 'Liker user not found' });
        }

        // Find the event by event_id
        const event = await Event.findById(event_id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Find the participant within the event's participants array
        const participant = event.participants.find(participant => participant._id.equals(participant_id));

        if (!participant) {
            return res.status(404).json({ message: 'Participant not found in event' });
        }

        // Ensure participant.likes is an array before using includes
        if (!Array.isArray(participant.likes)) {
            participant.likes = []; // Initialize likes array if it's not defined
        }

        // Check if the likerUser's ID is already in the likes array of the participant
        if (!participant.likes.includes(likerUser._id)) {
            participant.likes.push(likerUser._id);
        } else {
            return res.status(400).json({ message: 'User already liked this participant' });
        }

        // Save the updated event
        await event.save();

        res.status(200).json({ message: 'Participant liked successfully', event });
    } catch (error) {
        console.error('Error liking participant:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getAllEvents = async (req, res) => {
    try {
        // Fetch all events and populate host and participants details
        const events = await Event.find()
            .populate('host', 'name email') // Populate host details
            .populate('participants.user', 'name email'); // Populate participants details

        // Respond with the list of events
        res.status(200).json(events);
    } catch (error) {
        console.error('Error fetching events:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};



export const getAllEventNames = async (req, res) => {
    try {
        // Fetch only the eventName field from all events
        const eventNames = await Event.find({}, 'eventName');
        
        // Respond with the list of event names
        res.status(200).json(eventNames);
    } catch (error) {
        console.error('Error fetching event names:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


// controllers/eventController.js
export const getAllParticipants = async (req, res) => {
    try {
        // Fetch all events with the required fields
        const events = await Event.find({}, 'eventImage startDate participants').populate('participants.user', 'name email');

        // Extract participants from each event along with the event details
        const participants = events.reduce((acc, event) => {
            event.participants.forEach(participant => {
                acc.push({
                    eventId: event._id,
                    eventImage: event.eventImage,
                    eventName:event.eventName,
                    
                    startDate: event.startDate,
                    userId: participant.user._id,
                    userName: participant.user.name,
                    userEmail: participant.user.email,
                    imageUrl: participant.imageUrl,
                    likes: participant.likes,
                });
            });
            return acc;
        }, []);

        res.status(200).json(participants);
    } catch (error) {
        console.error('Error fetching participants:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getEventById = async (req, res) => {
    const { eventId } = req.body;
console.log(eventId,"eventId");
    try {
        // Find the event by _id
        const event = await Event.findById(eventId).populate('host', 'name email');

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }
        console.log(event,"event");
        res.status(200).json(event);
    } catch (error) {
        console.error('Error fetching event:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getParticipantsById=async (req, res) => {
    const { eventId, participantId } = req.body;

    try {
        // Find the event by eventId and populate the participants' user details
        const event = await Event.findById(eventId).populate('participants.user');

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Find the participant in the event
        const participant = event.participants.id(participantId);
        if (!participant) {
            return res.status(404).json({ error: 'Participant not found' });
        }

        // Find the user by the participant's user ID
        const user = await User.findById(participant.user);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Respond with the participant details along with the user details
        res.json({
            participant,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while fetching the participant' });
    }
};