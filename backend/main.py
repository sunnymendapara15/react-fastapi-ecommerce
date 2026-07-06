from typing import Dict, List, Optional

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr, Field

app = FastAPI(
    title="React + FastAPI Ecommerce API",
    description="Provides product catalog, cart, and checkout operations for the demo storefront.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)


class Product(BaseModel):
    id: int
    name: str
    description: str
    price: float
    inventory: int
    tags: List[str]
    image: str
    rating: float


class CartItemPayload(BaseModel):
    product_id: int
    quantity: int = Field(..., gt=0, description="Number of units to add")


class CartItemResponse(BaseModel):
    product_id: int
    name: str
    quantity: int
    price: float
    total: float


class CartResponse(BaseModel):
    items: List[CartItemResponse]
    subtotal: float
    tax: float
    shipping_estimate: float
    total: float


class CheckoutPayload(BaseModel):
    name: str
    email: EmailStr
    address: str
    shipping_method: str


class CheckoutResponse(BaseModel):
    message: str
    order_total: float
    items: List[CartItemResponse]


products_data = [
    {
        "id": 1,
        "name": "Solar-Powered Backpack",
        "description": "Carry 20L of gear while charging devices on the go with a waterproof solar panel.",
        "price": 129.0,
        "inventory": 18,
        "tags": ["eco", "travel", "tech"],
        "image": "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80",
        "rating": 4.7,
    },
    {
        "id": 2,
        "name": "Minimal Leather Tote",
        "description": "Handcrafted, vegetable-tanned leather tote designed for downtown workdays and weekend escapes.",
        "price": 184.0,
        "inventory": 9,
        "tags": ["craft", "lifestyle"],
        "image": "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
        "rating": 4.9,
    },
    {
        "id": 3,
        "name": "Wireless Noise-Cancelling Earbuds",
        "description": "Ambient-aware sound control, 30-hour playback, and an ergonomic charging case.",
        "price": 149.0,
        "inventory": 24,
        "tags": ["audio", "fitness"],
        "image": "https://images.unsplash.com/photo-1510070009289-b5bc34383727?auto=format&fit=crop&w=800&q=80",
        "rating": 4.5,
    },
    {
        "id": 4,
        "name": "Ceramic Pour-Over Kit",
        "description": "Precision dripper, handcrafted kettle, and tasting notes guide for the perfect brew.",
        "price": 98.0,
        "inventory": 30,
        "tags": ["home", "lifestyle"],
        "image": "https://images.unsplash.com/photo-1485807402261-5e0c2f4da111?auto=format&fit=crop&w=800&q=80",
        "rating": 4.6,
    },
    {
        "id": 5,
        "name": "All-Weather Travel Jacket",
        "description": "Breathable hardshell with ultralight insulation and customizable hoods.",
        "price": 219.0,
        "inventory": 12,
        "tags": ["travel", "outerwear"],
        "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",
        "rating": 4.8,
    },
]

cart_contents: Dict[int, int] = {}

def get_product_dict(product_id: int) -> Optional[dict]:
    return next((product for product in products_data if product["id"] == product_id), None)

def build_cart_response() -> CartResponse:
    items: List[CartItemResponse] = []
    subtotal = 0.0

    for product_id, quantity in cart_contents.items():
        product_data = get_product_dict(product_id)
        if not product_data:
            continue
        line_total = round(product_data["price"] * quantity, 2)
        items.append(
            CartItemResponse(
                product_id=product_id,
                name=product_data["name"],
                quantity=quantity,
                price=product_data["price"],
                total=line_total,
            )
        )
        subtotal += line_total

    subtotal = round(subtotal, 2)
    tax = round(subtotal * 0.07, 2)
    shipping_estimate = 0.0 if not subtotal or subtotal >= 100 else 9.0
    total = round(subtotal + tax + shipping_estimate, 2)

    return CartResponse(
        items=items,
        subtotal=subtotal,
        tax=tax,
        shipping_estimate=shipping_estimate,
        total=total,
    )

@app.get("/products", response_model=List[Product])
def list_products():
    return [Product(**product) for product in products_data]

@app.get("/products/{product_id}", response_model=Product)
def get_product(product_id: int):
    product = get_product_dict(product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    return Product(**product)

@app.get("/featured", response_model=Product)
def featured_product():
    if not products_data:
        raise HTTPException(status_code=404, detail="No featured product available.")
    return Product(**products_data[0])

@app.post("/cart", response_model=CartResponse)
def add_to_cart(payload: CartItemPayload):
    product = get_product_dict(payload.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found.")
    desired_quantity = cart_contents.get(payload.product_id, 0) + payload.quantity
    if desired_quantity > product["inventory"]:
        raise HTTPException(status_code=400, detail="Requested quantity exceeds available inventory.")
    cart_contents[payload.product_id] = desired_quantity
    return build_cart_response()

@app.get("/cart", response_model=CartResponse)
def get_cart():
    return build_cart_response()

@app.post("/cart/checkout", response_model=CheckoutResponse)
def checkout(payload: CheckoutPayload):
    current_cart = build_cart_response()
    if not current_cart.items:
        raise HTTPException(status_code=400, detail="Cart is empty.")
    for item in current_cart.items:
        product = get_product_dict(item.product_id)
        if product:
            product["inventory"] = max(product["inventory"] - item.quantity, 0)
    cart_contents.clear()

    return CheckoutResponse(
        message=f"Thanks {payload.name}! Your order will ship to {payload.address} via {payload.shipping_method}. A confirmation was sent to {payload.email}.",
        order_total=current_cart.total,
        items=current_cart.items,
    )
