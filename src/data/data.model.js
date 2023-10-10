const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
	prop_addr: {
		type: String,
		required: [true, "Property Address is required."],
	},
	footage: {
		type: Number,
		min: [0, "Square Footage must be a non-negative value."],
		required: [true, "Square Footage is required."],
	},
	arv: {
		type: Number,
		min: [0, "After Repair Value (ARV) must be a non-negative value."],
		required: [true, "After Repair Value (ARV) is required."],
	},
	list_price: {
		type: Number,
		min: [0, "List Price must be a non-negative value."],
		required: [true, "List Price is required."],
	},
	pmr: {
		type: Number,
		min: [0, "Projected Monthly Rent must be a non-negative value."],
		required: [true, "Projected Monthly Rent is required."],
	},
	rehab_type: {
		type: String,
		enum: ['Low_R1', 'Medium_R1', 'Heavy_R1', 'Additions_R1', 'Low_R2', 'Medium_R2', 'Heavy_R2', 'Additions_R2'],
		required: [true, "Rehab Type is required."],
	},
	evr: {
		type: Number,
		min: [0, "EVR must be a non-negative value."],
		required: [true, "Estimate Vacancy Rate (EVR) is required."],
	},
	emc: {
		type: Number,
		min: [0, "EMC must be a non-negative value."],
		required: [true, "Estimate Maintenance Cost (EMC) is required."],
	},
	MFoR: {
		type: Number,
		min: [0, "Management Fee of Rent (MFoR) must be non-negative."],
		required: [true, "Management Fee of Rent (MFoR) is required."],
	},
	search_cost: {
		type: Number,
		min: [0, "Title Insurance / Search Cost must be a positive value."],
		required: [true, "Title Insurance / Search Cost is required."],
	},
	mbc: {
		type: Number,
		min: [0, "Miscellaneous Buying Cost must be a positive value."],
		required: [true, "Miscellaneous Buying Cost (MBC) is required."],
	},
	exit_strategy: {
		type: String,
		enum: ['Rental', 'Light Rehab', 'High-end Rehab'],
		required: [true, "Exit Strategy is required."],
	},
	hold_time: {
		type: Number,
		min: [0, "Hold Time must be non-negative."],
		required: [true, "Hold Time is required."],
	},
	insurance: {
		type: Number,
		min: [0, "Insurance must be non-negative."],
		required: [true, "Insurance is required."],
	},
	HOA: {
		type: Number,
		min: [0, "HOA must be non-negative."],
		required: [true, "HOA is required."],
	},
	holding_cost: {
		type: Number,
		min: [0, "Holding cost must be non-negative."],
		required: [true, "Holding Cost is required."],
	},
	cash_borrow: {
		type: Boolean,
		required: [true, "Please a finance type."],
	},
	mao_ratio: {
		type: Number,
		min: [65, "MAO must be greater than or equal to 65"],
		max: [100, "MAO must be less than or equal to 100"],
		required: [true, "MAO is required."],
	},
	lender_fees: {
		type: Number,
		min: [0, "Lender Fees & Points must be non-negative."],
		required: [true, "Lender Fees & Points is required."],
	},
	loan_point_borrow: {
		type: Boolean,
		default: false
	},
	loan_term: {
		type: Number,
		min: [0, "Loan Terms must be non-negative."],
		required: [true, "Loan Term (Months) is required."],
	},
	interest_rate: {
		type: Number,
		min: [0, "Interest Rate must be non-negative."],
		required: [true, "Interest Rate is required."],
	},
	realtor_fees: {
		type: Number,
		min: [0, "Realtor Fees must be non-negative."],
		required: [true, "Realtor Fees is required."],
	},
	conv_fees: {
		type: Number,
		min: [0, "Transfer & Conveyance Fees"],
		required: [true, "Transfer & Conveyance Fees is required."],
	},
	misc_cost: {
		type: Number,
		min: [0, "Miscellaneous Selling Costs must be non-negative."],
		required: [true, "Miscellaneous Selling Costs is required."],
	},
	offers: [
		{
			offer: {
				type: String,
				enum: ['OFFER_1', 'OFFER_2', 'OFFER_3'],
				required: [true, "Offer Type is required."]
			},
			PCP: {
				type: Number,
				required: [true, "Projected Contract Price is required."]
			},
			wholesale_fee: {
				type: Number,
				required: [true, "Wholesale Fee is required."]
			}
		}
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
}, { timestamps: true });

const dataModel = mongoose.model('Data', dataSchema);

module.exports = dataModel;