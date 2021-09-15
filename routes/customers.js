const { Employee, validate } = require("../models/customer");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.get("/", auth, async (req, res) => {
  const customers = await Employee.find({user_id:req.user.user_id})
    .select("-__v")
    .sort("name");
  res.send(customers);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let id = 1; 
  await Employee.find({}).sort({ id: -1 }).limit(1).then(function(response) {
      if (response[0]) {
          id = parseInt(response[0].id) + 1;
      }
  });
  let employee = new Employee({
    id:id,
    name: req.body.name,
    email: req.body.email,
    phone: req.body.mobile,
    age:req.body.age,
    address : req.body.address,
    user_id : req.user.user_id
  });
  employee = await employee.save();

  res.send(employee);
});

router.put("/:id", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Employee.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.mobile,
      age:req.body.age,
      address : req.body.address
    },
    { new: true }
  );

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.delete("/:id", auth, async (req, res) => {
  const customer = await Employee.findByIdAndRemove(req.params.id);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

router.get("/:keys", auth, async (req, res) => {
  // console.log(req);
  // return false
  const pipeline = [
    {
      '$or' : {
        'name' : {$regex:".*"+req.params.keys+".*"|| '',"$options" :'i'},
        'phone' : {$regex:".*"+req.params.keys+".*"|| '',"$options" :'i'},
        'email' : {$regex:".*"+req.params.keys+".*"|| '',"$options" :'i'},
        // 'age' : {$regex:".*"+req.params.keys+".*"|| '',"$options" :'i'},
        'address' : {$regex:".*"+req.params.keys+".*"|| '',"$options" :'i'},
      }
    },
    {
      '$match' : {
      }
    }
  ]

  const val = ".*" + req.params.keys + ".*";
  
  const customer = await Employee.find().or([
  {"name" : new RegExp(val)},
  {"phone" : new RegExp(val)},
  {"email" : new RegExp(val)},
  // {"age" : new RegExp(val)},
  {"address" : new RegExp(val)},
    
  ]).and([{
    "user_id" : req.user.user_id
    
  }]);

  if (!customer)
    return res
      .status(404)
      .send("The customer with the given ID was not found.");

  res.send(customer);
});

module.exports = router;
