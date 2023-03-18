const express = require("express");
const router = express.Router();
const Agent = require("../models/agent");
const CardAgent = require("../models/agentcard");
const cleanBody = require("../middlewares/cleanBody");
const { v4: uuid } = require("uuid");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Order = require("../models/order");
const { sendEmail } = require("../helpers/mailer");

router.get("/", cleanBody, async (req, res) => {
  try {
    const agents = await Agent.find().sort({ _id: -1 });

    if (!agents) {
      return res.status(400).json({
        error: true,

        message: "No agents Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All agents.",
        agents: agents,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.get("/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;

    const agent = await Agent.findById(id,  { status: 0, instock: 0 } );
   


    if (!agent) {
      return res.status(400).json({
        error: true,

        message: "No agent Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "agents.",
        agent: agent,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.get("/card/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;

    const card = await CardAgent.findById(id);

    if (!card) {
      return res.status(400).json({
        error: true,

        message: "No card Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "card.",
        card: card,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/cards", cleanBody, async (req, res) => {
  try {
    const { page } = req.query;
    console.log("page", page);

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await CardAgent.countDocuments();
    const cards = await CardAgent.find().sort({ _id: -1 });
    console.log(cards);

    if (!cards) {
      return res.status(400).json({
        error: true,
        message: "No cards Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All agent cards.",
        cards: cards,
        total: total,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.get("/cards/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;

    const LIMIT = 10;
    //  const startIndex = (Number(page) - 1) * LIMIT;
    const total = await CardAgent.countDocuments();
    console.log("page2");

    const cards = await CardAgent.find({ agent: id }).sort({ _id: -1 });
    const statusArr = await CardAgent.find(
      { agent: id },
      { _id: 0, active: true, _id: true }
    );

    if (!cards) {
      return res.status(400).json({
        error: true,
        message: "No cards Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "All agent cards.",
        cards: cards,
        statusArr: statusArr,
        total: total,
        numberOfPages: Math.ceil(total / LIMIT),
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.get("/orders/:id", cleanBody, async (req, res) => {
  try {
    const { page } = req.query;
    const { id } = req.params;

    const LIMIT = 9;
    const startIndex = (Number(page) - 1) * LIMIT;
    const total = await Order.countDocuments();

    const orders = await Order.aggregate([
      {
        $match: {
          "order.agent": {
            $in: [id],
          },
        },
      },
      {
        $addFields: {
          order: {
            $filter: {
              input: "$order",
              cond: {
                $in: ["$$this.agent", [id]],
              },
            },
          },
        },
      },
    ])
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    const totalSale = await Order.aggregate([
      {
        $match: {
          "order.agent": {
            $in: [id],
          },
        },
      },
      {
        $addFields: {
          order: {
            $filter: {
              input: "$order",
              cond: {
                $in: ["$$this.agent", [id]],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          campaignMonth: { $month: "$createdAt" },
          campaignWeek: { $week: "$createdAt" },
          campaignYear: { $year: "$createdAt" },
          totalSale: { $sum: "$order.orderQty" },
        },
      },
      {
        $group: {
          _id: "$campaignMonth",
          totalSale: { $sum: "$totalSale" },
        },
      },
    ])
      .sort({ _id: -1 })
      .limit(LIMIT)
      .skip(startIndex);

    if (!orders) {
      return res.status(400).json({
        error: true,
        message: "No Order Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        orders: orders,
        total: total,
        currentPage: Number(page),
        numberOfPages: Math.ceil(total / LIMIT),
        totalSale: totalSale,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/", cleanBody, async (req, res) => {
  try {
    // const result = agentSchema.validate(req.body);

    const { email } = req.body;

    const agent = await agent.findOne({ email: email });

    if (agent) {
      return res.json({
        success: true,
        msg: "agent already exist",
      });
    }

    const newagent = new agent({
      title: req.body.title,
      description: req.body.description,
      agent: req.body.agent,
      price: req.body.price,
      point: req.body.point,
      agent: req.body.agent,
    });

    saveCover(newagent, req.body.cover);

    const Savedagent = await newagent.save();
    return res.status(200).json({
      success: true,
      message: "Registration Success",
      agent: savedagent,
    });

    // return res.redirect("/")
  } catch (error) {
    console.error("signup-error", error);
    return res.json({
      error: true,
      message: "Cannot Register",
    });
    // return res.status(500).json({
    //   error: true,
    //   message: "Cannot Register",
    // });
  }
});

router.post("/signup", cleanBody, async (req, res) => {
  try {
    const agent = new Agent({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      name: req.body.name,
      address: req.body.address,
    });

    // Check if agent email exist

    const existingAgent = await Agent.findOne({ email: agent.email });

    if (existingAgent) {
      return res.status(201).json({
        message: "This Email is registered",
        error: true,
      });
    }

    // check if password is entered correctly
    const check = agent.password === req.body.confirmPassword;

    if (!check) {
      return res.status(201).json({
        message: "Password does not match",
        error: true,
      });
    }

    const hash = await Agent.hashPassword(agent.password);

    const id = uuid(); //Generate unique id for the agent.

    agent.agentId = id;
    delete agent.confirmPassword;
    agent.password = hash;
    agent.point = 12.5;
    agent.totalPoint = 12.5;

    let code = Math.floor(1000000 + Math.random() * 900000); // Generate code for sending email

    let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms

    const sendCode = await sendEmail(agent.email, code);

    if (sendCode.error) {
      return res.status(500).json({
        error: true,
        message: "Couldn't send verification email.",
      });
    }
    agent.emailToken = code;
    agent.emailTokenExpires = new Date(expiry);

    const newAgent = new Agent(agent);
    await newAgent.save();
    return res.status(200).json({
      success: true,
      message: "A code has being sent to you mail",
      email: agent.email,
      agent: agent,
    });
  } catch (error) {
    //   console.error("agent-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
router.post("/admin/signup", cleanBody, async (req, res) => {
  try {
    const agent = new Agent({
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      name: req.body.name,
      address: req.body.address,
    });

    // Check if agent email exist

    const existingAgent = await Agent.findOne({ email: agent.email });

    if (existingAgent) {
      return res.status(201).json({
        message: "This Email is registered",
        error: true,
      });
    }

    // check if password is entered correctly
    const check = agent.password === req.body.confirmPassword;

    if (!check) {
      return res.status(201).json({
        message: "Password does not match",
        error: true,
      });
    }

    const hash = await Agent.hashPassword(agent.password);

    const id = uuid(); //Generate unique id for the agent.

    agent.agentId = id;
    delete agent.confirmPassword;
    agent.password = hash;
    agent.point = 12.5;
    agent.totalPoint = 12.5;

    // let code = Math.floor(1000000 + Math.random() * 900000); // Generate code for sending email

    // let expiry = Date.now() + 60 * 1000 * 15; //15 mins in ms

    // const sendCode = await sendEmail(agent.email, code);

    // if (sendCode.error) {
    //   return res.status(500).json({
    //     error: true,
    //     message: "Couldn't send verification email.",
    //   });
    // }
    // agent.emailToken = code;
    // agent.emailTokenExpires = new Date(expiry);

    const newAgent = new Agent(agent);
    await newAgent.save();
    return res.status(200).json({
      success: true,
      message: "Agent Created Successfully",
      email: agent.email,
      agent: agent,
    });
  } catch (error) {
    //   console.error("agent-error", error);
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if agent email exist

    const agent = await Agent.findOne({ email: email });

    if (!agent) {
      return res.status(201).json({
        error: true,
        message: "This Email does not exist",
      });
    }

    //3. Verify the password is valid
    const isValid = await Agent.comparePasswords(password, agent.password);

    if (!isValid) {
      return res.status(201).json({
        error: true,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { email: agent.email, id: agent._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login Successful",
      agent: agent,
      token,
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Enter Valid Details",
    });
  }
});

router.patch("/verify", async (req, res) => {
  const { code, email } = req.body;

  if (!email || !code) {
    return res.json({
      error: true,
      status: 400,
      message: "Please make a valid request",
    });
  }

  const agent = await Agent.findOne({
    email: email,
    emailToken: code,
    emailTokenExpires: { $gt: Date.now() },
  });
  if (!agent) {
    return res.status(201).json({
      error: true,
      message: "Invalid Details",
    });
  } else {
    if (agent.active)
      return res.send({
        success: true,
        message: "Account already activated",
        status: 400,
      });

    agent.emailToken = "";
    agent.emailTokenExpires = null;
    agent.active = true;
  }

  await agent.save();

  return res.status(200).json({
    success: true,
    message: "Account activated.",
    agent: agent,
  });
});
router.patch("/:id", async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No agent with that Id");

  const updatedagent = await Agent.findByIdAndUpdate(_id, {
    active: true,
  });

  res.json(updatedagent);
});
router.patch("/otherDetails/:id", async (req, res) => {
  const { id: _id } = req.params;
  const otherDetails = req.body;
  await agent.updateMany({}, [{ $set: { otherDetails: [] } }]);

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No agent with that Id");

  const updatedagent = await Agent.findByIdAndUpdate(
    _id,
    {
      otherDetails: otherDetails,
    },
    { new: true }
  );

  res.json({
    agent: updatedagent,
    success: true,
    message: "agent Succesfully Updated",
  });
});
router.patch("/delete/:id", async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Discount with that Id");

  await Agent.findByIdAndRemove(_id, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: "agent Succesfully Deleted",
  });
});

router.patch("/receipts/campaignImages/:id", async (req, res) => {
  const { id: _id } = req.params;

  const { selectedFiles } = req.body;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Receipt with that Id");

  const updatedagentReceipt = await CardAgent.findByIdAndUpdate(
    _id,
    { campaignFiles: selectedFiles },
    {
      new: true,
    }
  );

  return res.status(200).json({
    success: true,
    message: "Campaign Files Added",
  });
});

router.patch("/receipts/delete/:id", async (req, res) => {
  const { id: _id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(_id))
    return res.status(404).json("No Discount with that Id");

  const updatedReceipt = await CardAgent.findByIdAndDelete(_id, {
    new: true,
  });

  return res.status(200).json({
    success: true,
    message: "Campaign Deleted!!",
  });
});

router.get("/card/:id", cleanBody, async (req, res) => {
  try {
    const { id } = req.params;
    const card = await CardAgent.find({ userId: id });

    if (!card) {
      return res.status(400).json({
        error: true,
        message: "No card Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "card.",
        card: card,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: error.message,
    });
  }
});
// router.get("/cards/:id", cleanBody, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const cards = await CardAgent.find({ agentId: id }).sort({ _id: -1 });

//     if (!cards) {
//       return res.status(400).json({
//         error: true,
//         message: "No cards Found",
//       });
//     } else {
//       return res.status(200).json({
//         success: true,
//         message: "card.",
//         cards:cards
//       });
//     }
//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       message: error.message,
//     });
//   }
// });

router.post("/card", cleanBody, async (req, res) => {
  try {
    console.log("reqbody", req.body);
    const card = new CardAgent(req.body);

    const cardOne = await CardAgent.findOne({ email: card.email });
    console.log("cardOne", cardOne);

    if (cardOne) {
      return res.status(200).json({
        error: true,
        message: "This Email Already Have A Card",
      });
    } else {
      const newCard = await card.save();
      console.log("newCard", newCard);
      return res.status(200).json({
        success: true,
        message: "Success",
        card: newCard,
      });
    }
  } catch (error) {
    console.error("order-error", error);
    return res.json({
      error: true,
      message: "card submission error",
    });
  }
});

router.patch("/card/:id", async (req, res) => {
  const { id } = req.params;

  console.log(req.body);
  let card = req.body;
  card.status = "processing";
  card.paid = true;

  console.log("card", card);

  const updatedCard = await CardAgent.findOneAndUpdate({ email: id }, card, {
    new: true,
  });
  console.log("updatedCard", updatedCard);

  return res.status(200).json({
    success: true,
    message: "Card Application Success!!",
    card: updatedCard,
  });
});

module.exports = router;
