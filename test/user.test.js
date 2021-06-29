/**
 * @jest-environment node
 */
const request = require("supertest");
const app = require("./app-test");
const User = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");



const userID = mongoose.Types.ObjectId();
const user = {

    "_id":userID,
    "name":"Ram",
    "email":"shriramji@gmail.com",
    "password":"Jaishriram@26",
    "tokens":[{
        "token":jwt.sign({ "_id":userID },process.env.SECRET)
    }]
}


beforeEach(async () => {

    await User.deleteMany();
    await new User(user).save();

});


test("Test4 : Create User", async () => {

    // response holds the actual response returned by the server.
    const response = await request(app).post("/users/signup").send({
        "name":"Shyam",
        "email":"vishwashdwivedi26@gmail.com",
        "password":"Jaishriram@26"
    }).expect(201);

    const finduser = await User.findById(response.body.user._id);
    expect(finduser).not.toBeNull();

    expect(finduser.password).not.toBe("Jaishriram@26");

});


test("Test5 : Login existing User", async () => {

    const response = await request(app).post("/users/login").send({
        "email":"shriramji@gmail.com",
        "password":"Jaishriram@26"
    }).expect(200);

    const finduser = await User.findById(userID);
    expect(response.body.token).toBe(finduser.tokens[1].token);

});


test("Test6 : Failing request for non-existing User", async () => {

    await request(app).post("/users/login").send({
        "email":"unknown@gmail.com",
        "password":"unknown_unknown"
    }).expect(400);

});


test("Test7 : Testing Authentication", async () => {

    await request(app).get("/users/me")
                    .set("Authorization",`Bearer ${user.tokens[0].token}`)
                    .send()
                    .expect(200);

});


test("Test8: Delete User", async () => {

    await request(app).delete("/users/delete")
                .set("Authorization",`Bearer ${user.tokens[0].token}`)
                .send()
                .expect(200);

    const finduser = await User.findById(user._id);
    expect(finduser).toBeNull();        

});


test("Test9: Delete User Bad Request", async () => {

    await request(app).delete("/users/delete")
                .send()
                .expect(401);

});

