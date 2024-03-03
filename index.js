"use strict";

document.addEventListener("DOMContentLoaded", function () {
  let arrayResponse = [];
  fetch("https://xhqd-gsju-1k8b.n7c.xano.io/api:IduwFpOT/credits_price")
    .then((response) => response.json())
    .then((data) => {
      console.log("Credits Price:", data);
      arrayResponse = data;
      updatePricesBasedOnCurrency(currencySelect.value);
    })
    .catch((error) => console.error("Error fetching data:", error));
  function setPriceByCurrencyAndQuantity(
    currency,
    min,
    max,
    discountElementId
  ) {
    if (arrayResponse.length > 0) {
      const videos = arrayResponse.filter(
        (item) => item.type === "Video" && item.currency === currency
      );
      const video = videos.find((item) => item.min <= min && item.max >= max);
      if (video) {
        const discountElement = document.querySelector(
          `[wized="${discountElementId}"]`
        );
        if (discountElement) {
          discountElement.textContent = `${video.symbol}${video.cost}`;
        }
      }
    }
  }

  // Function to update all prices based on the selected currency
  function updatePricesBasedOnCurrency(currency) {
    setPriceByCurrencyAndQuantity(currency, 5, 9, "video_first_discount");
    setPriceByCurrencyAndQuantity(currency, 10, 19, "video_second_discount");
    setPriceByCurrencyAndQuantity(currency, 20, 1000, "video_third_discount");
  }

  // Listen for changes on the currency select element
  const currencySelect = document.querySelector('[wized="currency_select"]');
  if (currencySelect) {
    currencySelect.addEventListener("change", function () {
      updatePricesBasedOnCurrency(this.value);
    });
  }
  if (currencySelect && arrayResponse.length > 0) {
    updatePricesBasedOnCurrency(currencySelect.value);
  }
  let creditsToPurchase = 0;
  function updateCreditsDisplay() {
    const creditsElement = document.querySelector('[wized="video_credits"]');
    if (creditsElement) {
      creditsElement.textContent = creditsToPurchase;
    }
    updatePricePerCredit();
  }
  function updateAllPricesAndCredits() {
    updatePricesBasedOnCurrency(currencySelect.value);
    updatePricePerCredit();
  }
  if (currencySelect) {
    currencySelect.addEventListener("change", function () {
      updateAllPricesAndCredits();
    });
  }
  function updatePricePerCredit() {
    const currency = currencySelect.value;
    let effectiveCreditsToPurchase =
      creditsToPurchase > 0 ? creditsToPurchase : 1;

    const pricingTier = arrayResponse.find(
      (item) =>
        item.type === "Video" &&
        item.currency === currency &&
        effectiveCreditsToPurchase >= item.min &&
        effectiveCreditsToPurchase <= item.max
    );
    if (pricingTier) {
      let pricePerCredit = pricingTier.cost;
      let videoTotalPrice = pricingTier.cost * creditsToPurchase;
      const pricePerCreditElement = document.querySelector(
        '[wized="video_per_credit"]'
      );
      if (pricePerCreditElement) {
        pricePerCreditElement.textContent = `${
          pricingTier.symbol
        }${pricePerCredit.toFixed(2)}`;
      }
      const videoTotalElement = document.querySelector(
        '[wized="video_amount_to_spent"]'
      );
      if (videoTotalElement) {
        videoTotalElement.textContent = `${
          pricingTier.symbol
        }${videoTotalPrice.toFixed(2)}`;
      }
    }
    updateTotalAmountToBeSpent(); // Update the total after updating the price
  }
  function updateAllPricesAndCredits() {
    updatePricesBasedOnCurrency(currencySelect.value);
    updatePricePerCredit();
  }
  if (currencySelect) {
    currencySelect.addEventListener("change", function () {
      updateAllPricesAndCredits();
    });
  }
  updateCreditsDisplay();
  updateAllPricesAndCredits();
  const plusButton = document.querySelector('[wized="video_credits_plus"]');
  if (plusButton) {
    plusButton.addEventListener("click", function () {
      creditsToPurchase += 1;
      updateCreditsDisplay();
    });
  }
  const minusButton = document.querySelector('[wized="video_credits_minus"]');
  if (minusButton) {
    minusButton.addEventListener("click", function () {
      if (creditsToPurchase > 0) {
        creditsToPurchase -= 1;
        updateCreditsDisplay();
      }
    });
  }
  updateCreditsDisplay();
  let variationCreditsToPurchase = 0;
  function updateVariationCreditsDisplay() {
    const creditsElement = document.querySelector(
      '[wized="variation_credits"]'
    );
    if (creditsElement) {
      creditsElement.textContent = variationCreditsToPurchase;
    }
    updateVariationPricePerCredit();
  }
  function updateVariationPricePerCredit() {
    const currency = currencySelect.value; // Use the updated currency value
    const pricingTier = arrayResponse.find(
      (item) => item.type === "Variant" && item.currency === currency
    );
    if (pricingTier) {
      const pricePerCredit = pricingTier.cost;
      const variationTotalPrice = pricingTier.cost * variationCreditsToPurchase;

      const pricePerCreditElement = document.querySelector(
        '[wized="variation_per_credit"]'
      );
      if (pricePerCreditElement) {
        pricePerCreditElement.textContent = `${
          pricingTier.symbol
        }${pricePerCredit.toFixed(2)}`;
      }
      const variationTotalElement = document.querySelector(
        '[wized="variation_amount_to_spent"]'
      );
      if (variationTotalElement) {
        variationTotalElement.textContent = `${
          pricingTier.symbol
        }${variationTotalPrice.toFixed(2)}`;
      }
    }
    updateTotalAmountToBeSpent();
  }
  const variationPlusButton = document.querySelector(
    '[wized="variation_credits_plus"]'
  );
  if (variationPlusButton) {
    variationPlusButton.addEventListener("click", function () {
      variationCreditsToPurchase += 1;
      updateVariationCreditsDisplay();
      updateTotalAmountToBeSpent(); // Add this line
    });
  }
  const variationMinusButton = document.querySelector(
    '[wized="variation_credits_minus"]'
  );
  if (variationMinusButton) {
    variationMinusButton.addEventListener("click", function () {
      if (variationCreditsToPurchase > 0) {
        variationCreditsToPurchase -= 1;
        updateVariationCreditsDisplay();
        updateTotalAmountToBeSpent(); // Add this line
      }
    });
  }
  currencySelect.addEventListener("change", function () {
    updateAllPricesAndCredits();
    updateVariationCreditsDisplay();
  });
  updateVariationCreditsDisplay();
  let imageCreditsToPurchase = 0;
  function updateImageCreditsDisplay() {
    const creditsElement = document.querySelector('[wized="image_credits"]');
    if (creditsElement) {
      creditsElement.textContent = imageCreditsToPurchase;
    }
    updateImagePricePerCredit();
    updateTotalAmountToBeSpent(); // Add this line
  }
  function updateImagePricePerCredit() {
    const currency = currencySelect.value; // Use the updated currency value
    const pricingTier = arrayResponse.find(
      (item) => item.type === "Image" && item.currency === currency
    );
    if (pricingTier) {
      const pricePerCredit = pricingTier.cost;
      const imageTotalPrice = pricingTier.cost * imageCreditsToPurchase;

      const pricePerCreditElement = document.querySelector(
        '[wized="image_per_credit"]'
      );
      if (pricePerCreditElement) {
        pricePerCreditElement.textContent = `${
          pricingTier.symbol
        }${pricePerCredit.toFixed(2)}`;
      }

      const imageTotalElement = document.querySelector(
        '[wized="image_amount_to_spent"]'
      );
      if (imageTotalElement) {
        imageTotalElement.textContent = `${
          pricingTier.symbol
        }${imageTotalPrice.toFixed(2)}`;
      }
    }
    updateTotalAmountToBeSpent();
  }
  const imagePlusButton = document.querySelector(
    '[wized="image_credits_plus"]'
  );
  if (imagePlusButton) {
    imagePlusButton.addEventListener("click", function () {
      imageCreditsToPurchase += 1; // Increase variation credits
      updateImageCreditsDisplay(); // Update display
      updateTotalAmountToBeSpent(); // Add this line
    });
  }
  const imageMinusButton = document.querySelector(
    '[wized="image_credits_minus"]'
  );
  if (imageMinusButton) {
    imageMinusButton.addEventListener("click", function () {
      if (imageCreditsToPurchase > 0) {
        // Prevent going below 0
        imageCreditsToPurchase -= 1; // Decrease variation credits
        updateImageCreditsDisplay(); // Update display
        updateTotalAmountToBeSpent(); // Add this line
      }
    });
  }
  currencySelect.addEventListener("change", function () {
    updateAllPricesAndCredits(); // Existing function to update video prices
    updateImageCreditsDisplay(); // Update variation prices
    updateTotalAmountToBeSpent(); // Add this line
  });
  updateImageCreditsDisplay();

  function updateTotalAmountToBeSpent() {
    // Retrieve the current amounts for videos, variations, and images
    const videoAmountElement = document.querySelector(
      '[wized="video_amount_to_spent"]'
    );
    const variationAmountElement = document.querySelector(
      '[wized="variation_amount_to_spent"]'
    );
    const imageAmountElement = document.querySelector(
      '[wized="image_amount_to_spent"]'
    );
    const totalAmountElement = document.querySelector(
      '[wized="total_amount_to_spent"]'
    );
    const subTotalAmountElement = document.querySelector(
      '[wized="subtotal_amount_to_spent"]'
    );

    // Convert the content of each element to a number and sum them up
    const totalAmount = [
      videoAmountElement,
      variationAmountElement,
      imageAmountElement,
    ].reduce((acc, element) => {
      return (
        acc +
        (element
          ? parseFloat(element.textContent.replace(/[^0-9.-]+/g, ""))
          : 0)
      );
    }, 0);

    // Update the total amount element
    if (totalAmountElement) {
      // Assuming all amounts are in the same currency. Adjust if necessary to handle different currencies.
      const symbol = videoAmountElement
        ? videoAmountElement.textContent.replace(/[\d.,-]+/g, "").trim()
        : "";
      totalAmountElement.textContent = `${symbol}${totalAmount.toFixed(2)}`;
    }

    if (subTotalAmountElement) {
      // Assuming all amounts are in the same currency. Adjust if necessary to handle different currencies.
      const symbol = videoAmountElement
        ? videoAmountElement.textContent.replace(/[\d.,-]+/g, "").trim()
        : "";
      subTotalAmountElement.textContent = `${symbol}${totalAmount.toFixed(2)}`;
    }
  }

  Webflow.push(function () {
    // Target only the form with wized="checkout_form" attribute
    $('[wized="checkout_form"]').submit(function (e) {
      function sendStripeData(
        currency,
        videoAmount,
        variationAmount,
        imageAmount
      ) {
        // Retrieve the email from the input field
        const emailInput = document.querySelector(
          'input[wized="input_user_email"]'
        );
        const email = emailInput ? emailInput.value : "";

        // Find the checkout button
        const checkoutButton = document.querySelector(
          '[wized="checkout_button"]'
        );

        // Add 'is-loading' class to the checkout button
        checkoutButton.classList.add("is-loading");

        // Prepare the data to send
        const dataToSend = {
          currency,
          video_amount: videoAmount,
          variation_amount: variationAmount,
          image_amount: imageAmount,
          email,
        };

        // Make the API request
        fetch("https://xhqd-gsju-1k8b.n7c.xano.io/api:IduwFpOT/stripe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(dataToSend),
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            window.location.href = data;
          })
          .catch((error) => {
            console.error("Error:", error);
          })
          .finally(() => {
            // Remove 'is-loading' class from the checkout button once the request is completed or fails
            checkoutButton.classList.remove("is-loading");
          });
      }
      sendStripeData(
        currencySelect.value,
        creditsToPurchase,
        variationCreditsToPurchase,
        imageCreditsToPurchase
      );
      return false; // Prevent the form from submitting
    });
  });
});
