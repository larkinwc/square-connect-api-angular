import {AfterViewInit, Component, OnInit, NgModule} from '@angular/core';

declare var SqPaymentForm : any; //magic to allow us to access the SquarePaymentForm lib

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html'
})

export class PaymentComponent implements OnInit, AfterViewInit{

  constructor(){}

  paymentForm; //this is our payment form object

  ngOnInit(){
    // Set the application ID
    var applicationId = "sandbox-sq0idp-_5eUpZ_kZLEpEAlOJOa8-w";

    // Set the location ID
    var locationId = "CBASELjav8kAOzgP4SZlbX46e_IgAQ";
    this.paymentForm = new SqPaymentForm({

      // Initialize the payment form elements
      applicationId: applicationId,
      locationId: locationId,
      inputClass: 'sq-input',
    
      // Customize the CSS for SqPaymentForm iframe elements
      inputStyles: [{
          fontSize: '.9em'
      }],
    
    
    
      // Initialize the credit card placeholders
      cardNumber: {
        elementId: 'sq-card-number',
        placeholder: '•••• •••• •••• ••••'
      },
      cvv: {
        elementId: 'sq-cvv',
        placeholder: 'CVV'
      },
      expirationDate: {
        elementId: 'sq-expiration-date',
        placeholder: 'MM/YY'
      },
      postalCode: {
        elementId: 'sq-postal-code'
      },
    
      // SqPaymentForm callback functions
      callbacks: {
    
        /*
         * callback function: methodsSupported
         * Triggered when: the page is loaded.
         */
        methodsSupported: function (methods) {
    
          var applePayBtn = document.getElementById('sq-apple-pay');
          var applePayLabel = document.getElementById('sq-apple-pay-label');
          var masterpassBtn = document.getElementById('sq-masterpass');
          var masterpassLabel = document.getElementById('sq-masterpass-label');
    
          // Only show the button if Apple Pay for Web is enabled
          // Otherwise, display the wallet not enabled message.
          if (methods.applePay === true) {
            applePayBtn.style.display = 'inline-block';
            applePayLabel.style.display = 'none' ;
          }
          // Only show the button if Masterpass is enabled
          // Otherwise, display the wallet not enabled message.
          if (methods.masterpass === true) {
            masterpassBtn.style.display = 'inline-block';
            masterpassLabel.style.display = 'none';
          }
        },
    
        /*
         * callback function: createPaymentRequest
         * Triggered when: a digital wallet payment button is clicked.
         */
        createPaymentRequest: function () {
          // The payment request below is provided as
          // guidance. You should add code to create the object
          // programmatically.
          return {
            requestShippingAddress: true,
            currencyCode: "USD",
            countryCode: "US",
            total: {
              label: "Hakuna",
              amount: "{{REPLACE_ME}}",
              pending: false,
            },
            lineItems: [
              {
                label: "Subtotal",
                amount: "{{REPLACE_ME}}",
                pending: false,
              },
              {
                label: "Shipping",
                amount: "{{REPLACE_ME}}",
                pending: true,
              },
              {
                label: "Tax",
                amount: "{{REPLACE_ME}}",
                pending: false,
              }
            ]
          };
        },
    
        /*
         * callback function: cardNonceResponseReceived
         * Triggered when: SqPaymentForm completes a card nonce request
         */
        cardNonceResponseReceived: function (errors, nonce, cardData)  {
          if (errors) {
            // Log errors from nonce generation to the Javascript console
            console.log("Encountered errors:");
            errors.forEach(function(error) {
              console.log('  ' + error.message);
            });
    
            return;
          }
    
          alert('Nonce received: ' + nonce); /* FOR TESTING ONLY */
    
          // Assign the nonce value to the hidden form field
          // document.getElementById('card-nonce').value = nonce;
          //needs to be extracted from the
          (<HTMLInputElement>document.getElementById('card-nonce')).value = nonce; //casting so .value will work
          //get this value from the database when the user is logged in
          (<HTMLInputElement>document.getElementById('sq-id')).value = "CBASEC8F-Phq5_pV7UNi64_kX_4gAQ";
    
          // POST the nonce form to the payment processing page
          (<HTMLFormElement>document.getElementById('nonce-form')).submit();
    
        },
    
        /*
         * callback function: unsupportedBrowserDetected
         * Triggered when: the page loads and an unsupported browser is detected
         */
        unsupportedBrowserDetected: function() {
          /* PROVIDE FEEDBACK TO SITE VISITORS */
        },
    
        /*
         * callback function: inputEventReceived
         * Triggered when: visitors interact with SqPaymentForm iframe elements.
         */
        inputEventReceived: function(inputEvent) {
          switch (inputEvent.eventType) {
            case 'focusClassAdded':
              /* HANDLE AS DESIRED */
              break;
            case 'focusClassRemoved':
              /* HANDLE AS DESIRED */
              break;
            case 'errorClassAdded':
              /* HANDLE AS DESIRED */
              break;
            case 'errorClassRemoved':
              /* HANDLE AS DESIRED */
              break;
            case 'cardBrandChanged':
              /* HANDLE AS DESIRED */
              break;
            case 'postalCodeChanged':
              /* HANDLE AS DESIRED */
              break;
          }
        },
    
        /*
         * callback function: paymentFormLoaded
         * Triggered when: SqPaymentForm is fully loaded
         */
        paymentFormLoaded: function() {
          /* HANDLE AS DESIRED */
        }
      }
    });
     
  }
  requestCardNonce(event) {

    // Don't submit the form until SqPaymentForm returns with a nonce
    event.preventDefault();
  
    // Request a nonce from the SqPaymentForm object
    this.paymentForm.requestCardNonce();
  }
  ngAfterViewInit(){}
}
