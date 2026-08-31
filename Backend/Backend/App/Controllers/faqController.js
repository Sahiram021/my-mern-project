const faqModel = require("../Models/faqModel");

let faqCreate = async (req, res) => {
  let faqObj = req.body;

  try {
    let checkFaq = await faqModel.findOne({ q: faqObj.q });

    if (checkFaq) {
      res.send({
        message: "FAQ question already exist",
        status: 0,
        error: "FAQ question already exist...",
      });
      return;
    } else {
      let faqInsertObj = {
        q: faqObj.q,
        answer: faqObj.answer,
        status: faqObj.status,
        order: faqObj.order,
      };

      let data = await faqModel.insertOne(faqInsertObj);
      res.send({ message: "FAQ successfully created", status: 1, data });
    }
  } catch (err) {
    let errorObj = {};

    for (let errorKey in err.errors) {
      errorObj[errorKey] = err.errors[errorKey].message;
    }

    res.send({
      message: "Error in FAQ creation",
      status: 0,
      error: errorObj,
    });
  }
};

let faqView = async (req, res) => {
  let { q, answer, order } = req.query;
  let orCondition = [];

  if (q) {
    orCondition.push({ q: new RegExp(q, "i") });
  }

  if (answer) {
    orCondition.push({ answer: new RegExp(answer, "i") });
  }

  if (order) {
    orCondition.push({ order });
  }

  let filter = {};
  if (orCondition.length >= 1) {
    filter.$or = orCondition;
  }

  let data = await faqModel.find(filter);
  res.send({ message: "faq View", status: 1, data });
};

let faqDelete = async(req, res) => {
      let {id}=req.params
      // console.log(id);
      let delRes=await faqModel.deleteOne({_id:id})
  res.send({ message: "faq Delete", status: 1, delRes });
};

let faqmultiDelete=async(req,res)=>{
    let {ids}=req.body
    let delRes=await faqModel.deleteMany({_id:ids})
    res.send({ message: "faq Delete", status: 1, delRes });
    
}

let faqEdit = async (req, res) => {
  let { id } = req.params;
  let data = await faqModel.findOne({ _id: id });
  res.send({ message: "faq Edit", status: 1, data });
};

let faqUpdate = async (req, res) => {
  let { id } = req.params;
  let faqObj = req.body;

  let faqUpdateobj = {
    q: faqObj.q,
    answer: faqObj.answer,
    order: faqObj.order,
    status: faqObj.status,
  };

  let updateRes = await faqModel.updateOne({ _id: id }, { $set: faqUpdateobj });
  res.send({ message: "faq Update", status: 1, updateRes });
};

let changeStatus = async (req, res) => {
  let { ids } = req.body;

  for (let id of ids) {
    let oldFaq = await faqModel.findOne({ _id: id });
    await faqModel.updateOne(
      { _id: id },
      { $set: { status: !oldFaq.status } }
    );
  }

  res.send({ message: "FAQ status changed successfully", status: 1 });
};

let getFaqDetails = async (req, res) => {
  let { id } = req.params;
  let data = await faqModel
    .findOne({ _id: id })
    .select(["q", "answer", "order"]);
  res.send({ message: "FAQ view", status: 1, data });
};

module.exports = { faqCreate, faqView, faqDelete, faqEdit, faqUpdate, faqmultiDelete, changeStatus, getFaqDetails };
