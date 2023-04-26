import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        orderItems: [
            {
                slug: {type: String, required:true},
                name: {type: String, required:true},
                quantity: {type: Number, required:true},
                image: {type: String, required:true},
                ar: {type: String, required:true},
                from: {type: String},
                to: {type: String},
                totalAmount: {type: Number},
                totalDays: {type: Number},
                //product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product',required:true},
            }
        ],
        shippingAddress: {
            fullName: {type: String, required:true},
            telefon: {type: String, required:true},
            address: {type: String, required:true},
            city: {type: String, required:true},
            country: {type: String, required:true},
        },
        accomodationData: {
            wantRoom: {type: Boolean, required:true},
            roomType: {type: String},
            fromRoom: {type: Date},
            toRoom: {type: Date},
            totalDaysRoom: {type: Number},
            totalAmountRoom: {type: Number},
        },
        paymentMethod: {type: String, required: true},
        itemsPrice: {type: Number, required:true},
        paymentPrice: {type: Number, required:true},
        totalPrice: {type: Number, required:true},
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        isPaid: {type: Boolean, default: false},
        paidAt: {type:Date},
    },
    {
        timestamps: true,
    }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;