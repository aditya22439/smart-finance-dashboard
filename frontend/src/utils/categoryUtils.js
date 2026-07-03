export const categoryKeywords = {
  Bills: ["bill", "electricity", "water", "wifi", "internet", "recharge", "phone"],
  Education: ["course", "book", "school", "college", "tuition", "class"],
  Entertainment: ["movie", "game", "concert", "show", "ticket"],
  Food: ["food", "pizza", "burger", "coffee", "lunch", "dinner", "swiggy", "zomato", "restaurant"],
  Health: ["doctor", "medicine", "pharmacy", "hospital", "clinic", "gym"],
  Rent: ["rent", "landlord", "flat", "apartment"],
  Shopping: ["amazon", "flipkart", "order", "clothes", "shopping", "mall"],
  Subscription: ["netflix", "spotify", "prime", "hotstar", "subscription"],
  Travel: ["uber", "ola", "ride", "cab", "taxi", "bus", "train", "flight", "fuel"]
};
export const detectCategory=(note="")=>{ const text=String(note).toLowerCase(); const match=Object.entries(categoryKeywords).find(([,keywords])=>keywords.some((keyword)=>text.includes(keyword))); return match?.[0]||""; };
