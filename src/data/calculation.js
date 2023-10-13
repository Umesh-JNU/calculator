const ErrorHandler = require("../../utils/errorHandler");

function calculatePMT(r, n, pv, fv = 0, type = 0) {
  console.log({ r, n, pv })
  // r = rate
  // n = time
  // pv = principal value
  if (r === 0) {
    return -(pv + fv) / n;
  }

  const pmt = (r * (pv * Math.pow(1 + r, n) + fv)) / (Math.pow(1 + r, n) - 1);
  if (type === 1) {
    return pmt / (1 + r);
  }
  console.log({ pmt });
  return Math.round(pmt * 100) / 100;
}

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

exports.keyMetrics = (data, isReport = false) => {
  console.log({ data });
  const { list_price, arv, mao_ratio, exit_strategy, rehab_type, footage, hold_time, holding_cost, insurance, mbc, search_cost, pmr, HOA, MFoR, offers } = data;
  console.log({ offers, lastCalc: offers[offers.length - 1] })
  const { PCP, wholesale_fee, offer } = offers[offers.length - 1];

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

  const purchase_price = PCP + wholesale_fee;

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
  const annual_HOA_dues = HOA * 12;
  const annual_management_fee = MFoR * 0.01 * gross_rent;
  const annual_cash_flow_expense = annual_property_tax + annual_property_insurance + annual_HOA_dues + annual_management_fee;
  console.log({ annual_property_tax, annual_property_insurance, annual_HOA_dues, annual_management_fee, annual_cash_flow_expense });

  const annual_net_income = gross_rent - annual_cash_flow_expense;
  console.log({ gross_rent, annual_cash_flow_expense, annual_net_income })

  // const ROI = (annual_net_income / cash_to_close * 100).toFixed(2);
  const ROI = Math.round(annual_net_income / cash_to_close * 10000) / 100;

  if (!isReport) {
    return {
      mao_arv,
      projected_profit,
      purchase_price,
      ttl_holding_cost,
      buying_cost,
      ROI,
    }
  }

  const { evr, emc, loan_to_value, mortgage_int, loan_term, lender_fees, loan_points, loan_point_borrow, pmt_point_borrow, interest_rate, realtor_fees, conv_fees, misc_cost, flip_cost } = data;

  const getFlipCost = (pct, cost) => {
    const p1 = pct * 0.01;
    const p2 = 1 - p1;
    return {
      lien1: `${pct}%`,
      amt1: p1 * cost,
      lien2: `${p2 * 100}%`,
      amt2: p2 * cost
    };
  };

  const fc_pp = getFlipCost(flip_cost.purchase_price, purchase_price);
  const fc_rc = getFlipCost(flip_cost.rehab_cost, rehab_cost);
  const fc_bc = getFlipCost(flip_cost.buying_cost, buying_cost);
  const fc_hc = getFlipCost(flip_cost.holding_cost, ttl_holding_cost);
  console.log({
    flip_cost: {
      purchase_price: fc_pp,
      rehab_cost: fc_rc,
      buying_cost: fc_bc,
      holding_cost: fc_hc
    }
  });

  const annual_vaccancy_expense = evr * 0.01 * gross_rent;
  const annual_maintenance_expense = emc * 0.01 * gross_rent;
  const annual_operating_expense = annual_cash_flow_expense + annual_vaccancy_expense + annual_maintenance_expense;

  console.log({ annual_property_tax, annual_property_insurance, annual_HOA_dues, annual_management_fee, annual_cash_flow_expense, annual_vaccancy_expense, annual_maintenance_expense, annual_operating_expense });

  const loan_amount = purchase_price * loan_to_value * 0.01;
  const monthly_prnc_int = Math.abs(calculatePMT(mortgage_int * 0.01 / 12, loan_term, loan_amount));
  const annual_prnc_int = monthly_prnc_int * 12;

  // const annual_net_income = gross_rent - annual_cash_flow_expense;
  const monthly_net_income = Math.round((annual_net_income / 12) * 100) / 100;
  const annual_net_income_acq = Math.round((gross_rent - annual_cash_flow_expense - annual_prnc_int) * 100) / 100;
  const monthly_net_income_acq = Math.round((annual_net_income_acq / 12) * 100) / 100;

  console.log({ gross_rent, annual_cash_flow_expense, annual_net_income, monthly_net_income, loan_amount, monthly_prnc_int, annual_prnc_int, annual_net_income_acq, monthly_net_income_acq })

  const cash_to_close_acq = purchase_price - loan_amount + rental_rehab + buying_cost + loan_amount * (lender_fees * 0.01);
  const ROI_acq = Math.round(annual_net_income_acq / cash_to_close_acq * 10000) / 100;

  const annual_cash_flow = gross_rent - annual_operating_expense;
  const monthly_cash_flow = Math.round((annual_cash_flow / 12) * 100) / 100;
  const annual_cash_flow_acq = Math.round((annual_cash_flow - annual_prnc_int) * 100) / 100;
  const monthly_cash_flow_acq = Math.round((annual_cash_flow_acq / 12) * 100) / 100;

  const COCR = Math.round(annual_cash_flow / cash_to_close * 10000) / 100;
  const COCR_acq = Math.round(annual_cash_flow_acq / cash_to_close_acq * 10000) / 100;

  console.log({ cash_to_close_acq, ROI_acq, annual_cash_flow, monthly_cash_flow, annual_cash_flow_acq, monthly_cash_flow_acq, COCR, COCR_acq });

  // selling cost
  const sell_hold_cost = Math.round(((property_tax + insurance) / 12 + HOA + holding_cost) * hold_time * 100) / 100;


  // loan amount
  const total_loan_amt = {
    lien1: fc_pp.amt1 + fc_rc.amt1 + fc_bc.amt1 + fc_hc.amt1,
    lien2: 0,
  };

  const est_monthly_payment = {
    lien1: Math.round((total_loan_amt.lien1 * interest_rate.lien1 * 0.01 / 12) * 100) / 100,
    lien2: 0
  };
  const pmt_bor_val = pmt_point_borrow ? Math.round((est_monthly_payment.lien1 * hold_time) * 100) / 100 : 0;
  const loan_bor_val = loan_point_borrow ? Math.round((total_loan_amt.lien1 * (loan_points.lien1 / 100)) * 100) / 100 : 0;

  // lien 2 loan
  const inPctVal = (txt) => {
    return parseFloat(txt.split('%')[0]) * 0.01;
  };

  const r1 = "Purchase Price";
  const bor_loan_pmt_amt = r1 === "ARV"
    ? arv * inPctVal(fc_pp.lien2) + rental_rehab * inPctVal(fc_rc.lien2) + buying_cost * inPctVal(fc_bc.lien2) + buying_cost * inPctVal(fc_hc.lien2) + pmt_bor_val + loan_bor_val
    : purchase_price * inPctVal(fc_pp.lien2) + rental_rehab * inPctVal(fc_rc.lien2) + buying_cost * inPctVal(fc_bc.lien2) + sell_hold_cost * inPctVal(fc_hc.lien2) + pmt_bor_val + loan_bor_val;

  total_loan_amt.lien2 = Math.round(bor_loan_pmt_amt * 100) / 100;
  est_monthly_payment.lien2 = Math.round((total_loan_amt.lien2 * interest_rate.lien2 * 0.01 / 12) * 100) / 100;

  console.log({ bor_loan_pmt_amt, est_monthly_payment, pmt_bor_val, loan_bor_val, total_loan_amt });

  const fcl1 = loan_points.lien1 * total_loan_amt.lien1 / 100 + total_loan_amt.lien1 * (interest_rate.lien1 * 0.01) / 12 * hold_time;
  const fcl2 = loan_points.lien2 * total_loan_amt.lien2 / 100 + total_loan_amt.lien2 * (interest_rate.lien2 * 0.01) / 12 * hold_time;
  const finance_cost = Math.round((fcl1 + fcl2) * 100) / 100;

  console.log({ realtor_fees, arv, conv_fees, misc_cost });
  const selling_cost = Math.round((realtor_fees * 0.01 * arv + conv_fees * 0.01 * arv + misc_cost) * 100) / 100;

  console.log({ purchase_price, rehab_cost, buying_cost, sell_hold_cost, finance_cost, selling_cost });

  const ttl = purchase_price + rehab_cost + buying_cost + sell_hold_cost + finance_cost + selling_cost;
  const net_profit_dollar = Math.round((arv - ttl) * 100) / 100;
  const net_profit_pct = Math.round(net_profit_dollar / ttl * 10000) / 100;
  console.log({ net_profit_dollar, net_profit_pct })

  return {
    rental_analysis: {
      cost_basis: {
        cash: cost_basis,
        acq: cost_basis,
        dscr: 0
      },
      gross_rent: {
        cash: gross_rent,
        acq: gross_rent,
        dscr: 0
      },
      annual_property_tax: {
        cash: annual_property_tax,
        acq: annual_property_tax,
        dscr: 0
      },
      annual_property_insurance: {
        cash: annual_property_insurance,
        acq: annual_property_insurance,
        dscr: 0,
      },
      annual_HOA_dues: {
        cash: annual_HOA_dues,
        acq: annual_HOA_dues,
        dscr: 0
      },
      annual_management_fee: {
        cash: annual_management_fee,
        acq: annual_management_fee,
        dscr: 0
      },
      annual_cash_flow_expense: {
        cash: annual_cash_flow_expense,
        acq: annual_cash_flow_expense,
        dscr: 0
      },
      annual_vaccancy_expense: {
        cash: annual_vaccancy_expense,
        acq: annual_vaccancy_expense,
        dscr: 0
      },
      annual_maintenance_expense: {
        cash: annual_maintenance_expense,
        acq: annual_maintenance_expense,
        dscr: 0
      },
      annual_operating_expense: {
        cash: annual_operating_expense,
        acq: annual_operating_expense,
        dscr: 0
      }
    },
    summary_return: {
      annual_net_income: {
        cash: annual_net_income,
        acq: annual_net_income_acq,
        dscr: 0
      },
      monthly_net_income: {
        cash: monthly_net_income,
        acq: monthly_net_income_acq,
        dscr: 0
      },
      annual_ROI: {
        cash: ROI,
        acq: ROI_acq,
        dscr: 0
      }
    },
    summary_return_res: {
      annual_cash_flow: {
        cash: annual_cash_flow,
        acq: annual_cash_flow_acq,
        dscr: 0
      },
      monthly_cash_flow: {
        cash: monthly_cash_flow,
        acq: monthly_cash_flow_acq,
        dscr: 0
      },
      annual_COCR: {
        cash: COCR,
        acq: COCR_acq,
        dscr: 0
      }
    },
    flip_cost: {
      hold_time: hold_time,
      finance_cost: {
        purchase_price: fc_pp,
        rehab_cost: fc_rc,
        buying_cost: fc_bc,
        holding_cost: fc_hc,
        loan_points: loan_points,
        payment_borrow: {
          lien1: pmt_point_borrow ? "Yes" : "No",
          lien2: pmt_bor_val
        },
        loan_borrow: {
          lien1: loan_point_borrow ? "Yes" : "No",
          lien2: loan_bor_val
        },
        total_loan_amt: total_loan_amt,
        est_monthly_payment: est_monthly_payment
      }
    },
    selling_cost: {
      realtor_fees,
      conv_fees,
      misc_cost
    },
    deal_result: {
      purchase_price,
      rehab_cost,   // this may change
      buying_cost,
      holding_cost: sell_hold_cost,
      finance_cost,
      selling_cost,
      net_profit_dollar,
      net_profit_pct
    }
  }
}
