import TravelLog from "../models/TravelLog.model.js";
import cloudinary from "../lib/config/cloudinary.js";
import User from "../models/User.model.js";

export const createTravelLog = async (req, res) => {
  try {
    const { title, description, visitedDate, location, rating } = req.body;

    const userId = req.user._id;

    // Input validation
    if (!title || !description || !visitedDate || !location) {
      return res.status(400).json({
        message:
          "The fields title, description, visited date and location are required"
      });
    }

    // Validate location coordinates
    if (location.lat < -90 || location.lat > 90) {
      return res.status(400).json({ message: "Invalid latitude" });
    }
    if (location.lng < -180 || location.lng > 180) {
      return res.status(400).json({ message: "Invalid longitude" });
    }

    // Get uploaded images from busboy middleware
    const uploadedImages = req.uploadedImages || [];

    const travelLogData = {
      user: userId,
      title,
      description,
      visitedDate: new Date(visitedDate),
      location: {
        lat: parseFloat(location.lat),
        lng: parseFloat(location.lng)
      },
      images: uploadedImages,
      rating: rating ? parseInt(rating, 5) : 0
    };

    const travelLog = new TravelLog(travelLogData);
    const savedTravelLog = await travelLog.save();

    // Automatically add log ID to user
    await User.findByIdAndUpdate(userId, {
      $push: { travelLogs: savedTravelLog._id }
    });

    res.status(201).json(savedTravelLog);
  } catch (error) {
    console.error("Error creating travel log:", error);
    res.status(500).json({ message: "Error creating travel log" });
  }
};

export const getAllTravelLogs = async (req, res) => {
  try {
    const travelLogs = await TravelLog.find({ user: req.user._id });

    if (travelLogs.length === 0) {
      return res.status(404).json({ message: "No travel logs found" });
    }

    res.json(travelLogs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching travel logs" });
  }
};

export const getTravelLogById = async (req, res) => {
  try {
    const travelLogId = req.params.id;

    const travelLog = await TravelLog.findById(travelLogId);
    if (!travelLog) {
      return res.status(404).json({ message: "Travel log not found" });
    }

    // Ownership check
    if (travelLog.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this travel log" });
    }

    res.json(travelLog);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching travel log" });
  }
};

export const updateTravelLog = async (req, res) => {
  try {
    const travelLog = await TravelLog.findById(req.params.id);

    if (!travelLog) {
      return res.status(404).json({ message: "Travel log not found" });
    }

    // Ownership check
    if (travelLog.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this travel log" });
    }

    // Extract fields from req.body (FormData)
    const { title, description, visitedDate, rating, location } = req.body;

    // Validate inputs
    if (title && typeof title !== 'string') {
      return res.status(400).json({ message: "Title must be a string" });
    }
    if (description && typeof description !== 'string') {
      return res.status(400).json({ message: "Description must be a string" });
    }

    // Prepare update data with defaults from existing travelLog
    const updateData = {
      title: title || travelLog.title,
      description: description || travelLog.description,
      visitedDate: visitedDate ? new Date(visitedDate) : travelLog.visitedDate,
      rating: rating ? parseInt(rating, 10) : travelLog.rating,
      location: travelLog.location, // Default to existing location
    };

    // Parse and validate location if provided
    if (location) {
      let parsedLocation;
      try {
        parsedLocation = typeof location === 'string' ? JSON.parse(location) : location;
      } catch (error) {
        return res.status(400).json({ message: "Invalid location format", error });
      }

      // Validate location coordinates
      if (parsedLocation.lat < -90 || parsedLocation.lat > 90) {
        return res.status(400).json({ message: "Invalid latitude" });
      }
      if (parsedLocation.lng < -180 || parsedLocation.lng > 180) {
        return res.status(400).json({ message: "Invalid longitude" });
      }

      updateData.location = {
        lat: parseFloat(parsedLocation.lat),
        lng: parseFloat(parsedLocation.lng),
      };
    }

    // Validate visitedDate if provided
    if (visitedDate && new Date(visitedDate) > new Date()) {
      return res.status(400).json({ message: "Visited date cannot be in the future" });
    }

    updateData.images = [...travelLog.images, ...(req.uploadedImages || [])];
    console.log('Updated images:', updateData.images);

    // Update the travel log
    const updatedLog = await TravelLog.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json(updatedLog);
  } catch (error) {
    console.error("Error updating travel log:", error);
    res.status(500).json({ message: "Error updating travel log" });
  }
};

export const deleteTravelLog = async (req, res) => {
  try {
    const travelLog = await TravelLog.findById(req.params.id);

    if (!travelLog) {
      return res.status(404).json({ message: "Travel log not found" });
    }

    // Ownership check
    if (travelLog.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this travel log" });
    }

    await travelLog.deleteOne();

    // Delete images from Cloudinary
    if(travelLog.images.length > 0){
    await Promise.all(
      travelLog.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.publicId);
      })
    );
  }

    // Optionally: Remove the log reference from the User model
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { travelLogs: travelLog._id }
    });

    res.json({ message: "Travel log deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting travel log" });
  }
};
