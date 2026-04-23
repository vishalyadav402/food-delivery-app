export const DELIVERY_RULES = {
  minOrder: 100,
  freeDeliveryAbove: 299,
  baseCharge: 20,
};


export const calculateDelivery = (cartTotal) => {
  if (cartTotal < DELIVERY_RULES.minOrder) {
    return {
      allowed: false,
      message: `Minimum order ₹${DELIVERY_RULES.minOrder}`,
    };
  }

  if (cartTotal >= DELIVERY_RULES.freeDeliveryAbove) {
    return {
      allowed: true,
      charge: 0,
      message: "Free Delivery 🎉",
    };
  }

  return {
    allowed: true,
    charge: DELIVERY_RULES.baseCharge,
    message: `Delivery ₹${DELIVERY_RULES.baseCharge}`,
  };
};