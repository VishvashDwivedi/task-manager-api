const {   fahrenheitToCelsius , celsiusToFahrenheit , add   } = require("./math");

// test("Test1", () => {

//     const val = fun(6,20);
//     // if(val !== 60)  throw new Error("This is an Error !");
// // For equality test cases , we can use defined functions ! Such as ,
//     expect(val).toBe(60);

// });

test("Test1", () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
});

test("Test2", () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
});

// This test runs perfect since while the code is running , the result is not 
// calculated... ( Because it is the asynchronous code ! )
// test("Test3", () => {

//     // expect(add(2,3)).toBe(6);
//     setTimeout(() => {
//         expect(2+3).toBe(6);
//     },2000); 
// });

// For async code , we can opt as ,
// We can call done after our asynchronous process is executed ...
// test("Test3", (done) => {

//     setTimeout(() => {
//         expect(1).toBe(6);
//         done();
//     },2000);

// });


// test("Test4", (done) => {

//     add(2,3).then((sum) => {
//         expect(sum).toBe(5);
//         done();
//     });

// });

// OR SAME CODE CAN BE WRITTEN AS ,

test("Test3", async () => {

    const val = await add(2,3);
    expect(val).toBe(5);
    
});

