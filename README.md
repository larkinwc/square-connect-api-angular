# Square Payment processing example: Python Client; Angular Front End

This sample demonstrates processing card payments with Square Connect API, using the
Square Connect Python client library to capture the information, and Angular for the front end.

## Requirements

Tested with Angular 5.2+

## Setup

### Using the Angular example

1. Add the payment form script to the header of your app (https://js.squareup.com/v2/paymentform) 

2. Copy the ts code, and use either the HTML for it, or check out the [base HTML](https://github.com/square/connect-api-examples/blob/master/connect-examples/v2/python_payment/index.html)

3. Replace of modify the form action so it will hit the API you are using to store the info returned from square. 

### the Python client library example

Checkout the original Python client library example at https://github.com/square/connect-api-examples/tree/master/connect-examples/v2/python_payment for more info

### Provide required credentials

The`Typescript` has values near the top of the file
that you need to replace with various credentials associated with your application.
If you're just testing things out, it's recommended that you use your _sandbox_
credentials for now. See
[this article](https://docs.connect.squareup.com/articles/using-sandbox/)
for more information on the API sandbox.

You can `grep` for `REPLACE_ME` to find all of the fields to replace.


## Running the sample

From the sample's root directory, run:

    ng serve

You can then visit your dev instance of `localhost:4200` in your browser to see the card form.

If you're using your sandbox credentials, you can test a valid credit card
transaction by providing the following card information in the form:

* Card Number 4532 7597 3454 5858
* Card CVV 111
* Card Expiration (Any time in the future)
* Card Postal Code (Any valid US postal code)

You can find more testing values in this [article](https://docs.connect.squareup.com/articles/using-sandbox)

**Note that if you are _not_ using your sandbox credentials and you enter _real_
credit card information, YOU WILL CHARGE THE CARD.**