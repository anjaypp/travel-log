import TravelLog from "../models/TravelLog.model.js";
import cloudinary from "../lib/config/cloudinary.js";
import User from "../models/User.model.js";

export const createTravelLog = async (req, res) => {
  try {
    const {
      title,
      description,
      visitedDate,
      location,
      rating
    } = req.body;

    const userId = req.user._id;

    // Input validation
    if (!title || !description || !visitedDate || !location) {
      return res
        .status(400)
        .json({
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

    // Upload images to Cloudinary
    let uploadedImages = [];

    if(req.files && req.files.length > 0) {
      const uploadToCloudinary = (file) => {
        return new Promise((resolve, reject) => {
         const uploadStream = cloudinary.uploader.upload_stream(
          {resource_type: "image", folder: "travel-logs"},
          (error, result) => {
            if(error) return reject(error);
            resolve({
              url: result.secure_url,
              publicId: result.public_id
            });
          }
        );
        uploadStream.end(file.buffer);
        });
      };

      uploadedImages = await Promise.all(
        req.files.map(uploadToCloudinary)
      );
    }


    // Create new travel log
    const travelLog = new TravelLog({
      user: userId,
      title,
      description,
      visitedDate,
      location,
      images: uploadedImages,
      rating
    });

    await travelLog.save();

    // Automatically add log ID to user
    await User.findByIdAndUpdate(userId, {
      $push: { travelLogs: travelLog._id }
    });

    res.status(201).json(travelLog);
  } catch (error) {
    console.error(error);
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

    const updatedLog = await TravelLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      },
    );

    res.json(updatedLog);
  } catch (error) {
    console.error(error);
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
    await Promise.all(
      travelLog.images.map(async (image) => {
        await cloudinary.uploader.destroy(image.publicId);
      })
    );

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
