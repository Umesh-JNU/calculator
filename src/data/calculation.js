const getRepairCost = (rehab_type) => {
  return process.env[rehab_type];
}

const getRehabCost = (exit_strategy, rehab_type, footage) => {
  console.log({ exit_strategy, rehab_type, footage })
  const repair_cost = getRepairCost(rehab_type);
  const rental_rehab = footage * repair_cost;
  const light_flip_rehab = rental_rehab * 1.5;
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
      throw new Error("Bad Request");
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

module.exports = (data) => {
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

