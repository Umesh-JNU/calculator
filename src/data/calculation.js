const ErrorHandler = require("../../utils/errorHandler");

const getRepairCost = (rehab_type) => {
  return parseInt(process.env[rehab_type]);
}

const getRehabCost = (exit_strategy, rehab_type, footage) => {
  console.log({ exit_strategy, rehab_type, footage })
  const repair_cost = getRepairCost(rehab_type);
  const rental_rehab = footage * repair_cost;
  const light_flip_rehab = Math.ceil(rental_rehab * 1.5);
  const high_end_rehab = rental_rehab * 2;

  console.log({ repair_cost, rental_rehab, light_flip_rehab, high_end_rehab });

  switch (exit_strategy) {
    case 'Rental':
      return rental_rehab;
    case 'Light Rehab':
      return light_flip_rehab;
    case 'High-end Rehab':
      return high_end_rehab;
    default:
      throw new ErrorHandler("Bad Request", 400);
  }
}

const getOffer1 = (mao_lp, mao_arv, list_price) => {
  if (mao_lp < 100) {
    if (list_price <= process.env.B16)
      return mao_arv - process.env.C16;
    else if (list_price <= process.env.B17)
      return mao_arv - process.env.C17;
    else if (list_price <= process.env.B18)
      return mao_arv - process.env.C18;
    else if (list_price <= process.env.B19)
      return mao_arv - process.env.C19;
    else
      return list_price - process.env.C20;
  }
  else {
    if (list_price <= process.env.B16)
      return list_price - process.env.C16;
    else if (list_price <= process.env.B17)
      return list_price - process.env.C17;
    else if (list_price <= process.env.B18)
      return list_price - process.env.C18;
    else if (list_price <= process.env.B19)
      return list_price - process.env.C19;
    else
      return list_price - process.env.C20
  }
}
const getOffer2 = (mao_lp, mao_arv, list_price) => {
  if (mao_lp < 100) {
    if (list_price <= process.env.B16)
      return mao_arv - process.env.D16;
    else if (list_price <= process.env.B17)
      return mao_arv - process.env.D17;
    else if (list_price <= process.env.B18)
      return mao_arv - process.env.D18;
    else if (list_price <= process.env.B19)
      return mao_arv - process.env.D19;
    else
      return list_price - process.env.D20;
  }
  else {
    if (list_price <= process.env.B16)
      return list_price - process.env.D16;
    else if (list_price <= process.env.B17)
      return list_price - process.env.D17;
    else if (list_price <= process.env.B18)
      return list_price - process.env.D18;
    else if (list_price <= process.env.B19)
      return list_price - process.env.D19;
    else
      return list_price - process.env.D20;
  }
}
const getOffer3 = (mao_lp, mao_arv, list_price) => {
  if (mao_lp < 100) {
    if (list_price <= process.env.B16)
      return mao_arv - process.env.E16;
    else if (list_price <= process.env.B17)
      return mao_arv - process.env.E17;
    else if (list_price <= process.env.B18)
      return mao_arv - process.env.E18;
    else if (list_price <= process.env.B19)
      return mao_arv - process.env.E19;
    else
      return list_price - process.env.E20;
  }
  else {
    if (list_price <= process.env.B16)
      return list_price - process.env.E16;
    else if (list_price <= process.env.B17)
      return list_price - process.env.E17;
    else if (list_price <= process.env.B18)
      return list_price - process.env.E18;
    else if (list_price <= process.env.B19)
      return list_price - process.env.E19;
    else
      return list_price - process.env.E20;
  }
}

exports.evaluate = (data) => {
  console.log({ data });
  const { list_price, arv, mao_ratio, exit_strategy, rehab_type, footage } = data;

  const rehab_cost = getRehabCost(exit_strategy, rehab_type, footage);
  const mao_arv = arv * (mao_ratio / 100) - rehab_cost;
  const mao_lp = list_price / mao_arv;

  return {
    initial_offer: getOffer1(mao_lp, mao_arv, list_price),
    second_offer: getOffer2(mao_lp, mao_arv, list_price),
    final_offer: getOffer3(mao_lp, mao_arv, list_price)
  };
};

exports.keyMetrics = (data, offer) => {
  console.log({ data, offer });
  const { list_price, arv, mao_ratio, exit_strategy, rehab_type, footage, hold_time, holding_cost, insurance, mbc, search_cost, pmr, HOA, MFoR } = data;

  const rehab_cost = getRehabCost(exit_strategy, rehab_type, footage);
  const mao_arv = arv * (mao_ratio / 100) - rehab_cost;
  const mao_lp = list_price / mao_arv;

  const { initial_offer, second_offer, final_offer } = this.evaluate(data);
  console.log({ initial_offer, second_offer, final_offer });

  switch (offer) {
    case 'OFFER_1':
      var projected_profit = mao_arv - getOffer1(mao_lp, mao_arv, list_price);
      break;

    case 'OFFER_2':
      var projected_profit = mao_arv - getOffer2(mao_lp, mao_arv, list_price);
      break;

    case 'OFFER_3':
      var projected_profit = mao_arv - getOffer3(mao_lp, mao_arv, list_price);
      break;

    default:
      throw new ErrorHandler("Bad Request", 400);
      break;
  }

  const purchase_price = parseInt(process.env.PROJECT_CONTRACT_PRICE) + parseInt(process.env.WHOLESALE_FEE);

  const property_tax = 2975
  const ttl_holding_cost = Math.ceil(hold_time * (holding_cost + (property_tax + insurance) / 12));
  const buying_cost = mbc + purchase_price * search_cost * 0.01;

  const rental_rehab = footage * getRepairCost(rehab_type);
  const cost_basis = purchase_price + rental_rehab + buying_cost;
  const cash_to_close = cost_basis;

  const gross_rent = pmr * 12;

  console.log({ rental_rehab, cost_basis, cash_to_close, gross_rent });

  const annual_property_tax = property_tax;
  const annual_property_insurance = insurance;
  const annual_HOA_dues = HOA;
  const annual_management_fee = MFoR * 0.01 * gross_rent;
  const annual_cash_flow_expense = annual_property_tax + annual_property_insurance + annual_HOA_dues + annual_management_fee;
  console.log({ annual_property_tax, annual_property_insurance, annual_HOA_dues, annual_management_fee, annual_cash_flow_expense });

  const annual_net_income = gross_rent - annual_cash_flow_expense;
  console.log({ gross_rent, annual_cash_flow_expense, annual_net_income })
  // const ROI = (annual_net_income / cash_to_close * 100).toFixed(2);
  const ROI = Math.round(annual_net_income / cash_to_close * 10000) / 100;

  return {
    mao_arv,
    projected_profit,
    purchase_price,
    ttl_holding_cost,
    buying_cost,
    ROI,
  }
};