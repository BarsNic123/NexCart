# NexCart

Frontend clone of [nexcart.in](https://nexcart.in/) with five working features. Open `index.html` in a browser.

## Features

1. **Product search** — live suggestions in the header, then filtered shop results
2. **Shop catalog** — category filters, price sorting, product details
3. **Sell laptop** — instant valuation quote from model, RAM, and condition
4. **Shopping cart** — add, change quantity, remove, and checkout
5. **My account** — register, log in, and log out (saved in the browser)

Cart and accounts use `localStorage` so they persist on refresh.

## Run locally

Double-click `index.html`, or from this folder:

```bash
npx --yes serve .
```

# Update notes
- productinventory is now stored in localinventory for demonstration purposes.
- productinventory is now used in place of the PRODUCTS array for demonstration purposes so changes to stock can reflect properly.
note: unlike the Cart array which persists, the inventory is reset to default values when you refresh.

CART:
- working qty buttons for cart page
- added logic to:
    - return an error if exceeding inventory quantity
    - disable and white out the "-" button if qty is 1
    - disable and white out the "+" button if cart product qty is greater than or equal to available product stock
- Clicking the Checkout button now deducts from inventory stock.
- Click the Checkout button returns an error if:
    - the amount of product in the cart specifies exceeds the amount of units in inventory. 

- Adding to cart via the "Add to Cart" button the product card returns an error if:
    - stock is unavailable.
    - if current quantity in cart exceeds the available stock.
------------------
## Bugfixes:
- ~~Cannot use the "Add to cart" button to add OTHER products to the cart if the entire stock of at least one product is already in the cart.~~
- ~~Cannot use the "-" quantity button to deduct from the specified quantity in the cart if the current quantity exceeds inventory stock.~~
- ~~Product card does not get disabled if product is out of stock.~~
------
## Todo(?)
- Create an inventory page? 
- Require logging in to add to cart/check out
- Adapt the app to use a proper database eventually
