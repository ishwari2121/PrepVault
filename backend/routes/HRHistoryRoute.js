import express from "express";
import VoteHistory from "../models/HRHistory.js";
const router = express.Router();


router.get('/:username/:question_id/:answer_id/votehistory', async (req, res) => {
    try {
      const { username, question_id, answer_id } = req.params;
  
      const vote = await VoteHistory.findOne({ 
        username, 
        question_id, 
        answer_id 
      })
  
      if (!vote) {
        return res.status(201).json({ success : false });
      }
  
      res.status(200).json(vote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
});

router.get('/:username/:question_id/votehistory', async (req, res) => {
    try {
      const { username, question_id } = req.params;
  
      const vote = await VoteHistory.findOne({ 
        username, 
        question_id
      })
  
      if (!vote) {
        return res.status(201).json({ success : false });
      }
  
      res.status(200).json(vote);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Server error" });
    }
});



router.post("/:question_Id/answers/:answer_Id/votehistory", async (req, res) => {
  try {
    const { question_Id, answer_Id } = req.params;
    const { username, action } = req.body;

    const newObj = new VoteHistory({
      username,
      question_id: question_Id,
      answer_id: answer_Id,
      action,
    });

    await newObj.save();

    res.status(201).json({
      message: "Vote saved successfully",
      id: newObj._id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:username/:question_id/:answer_id/delete", async (req, res) => {
  try {
    const { username,question_id,answer_id} = req.params;

    const deletedVote = await VoteHistory.findOneAndDelete({
      username,
      question_id,
      answer_id,
    });

    if (!deletedVote) {
      return res.status(404).json({ message: "Vote record not found"});
    }

    res.status(200).json({ message: "Vote deleted successfully", deletedVote });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/:questionId/:answerId/delete_all_votes", async (req, res) => {
    try {
      const { questionId, answerId} = req.params;
  
      const result = await VoteHistory.deleteMany({
        question_id: questionId,
        answer_id: answerId,
      });
  
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "No matching vote history found" });
      }
  
      res.status(200).json({
        message: "Vote history deleted successfully",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("Error deleting vote history:", error);
      res.status(500).json({ error: "Server error" });
    }
  });

router.put("/:username/:question_id/:answer_id/update", async (req, res) => {
    try {
      const { username, question_id, answer_id } = req.params;
      const { action } = req.body;
  
      if (!["upvote", "downvote"].includes(action)) {
        return res.status(400).json({ message: "Invalid action" });
      }

      const updatedVote = await VoteHistory.findOneAndUpdate(
        { username, question_id, answer_id },
        { action, updated_at: Date.now() },
        { new: true }
      );
  
      if (!updatedVote) {
        return res.status(404).json({ message: "Vote record not found" });
      }
  
      res.status(200).json({
        message: "Vote action updated successfully",
        updatedVote,
      });
    } catch (error) {
      console.error("Update error:", error);
      res.status(500).json({ error: "Server error" });
    }
  });
export default router;
