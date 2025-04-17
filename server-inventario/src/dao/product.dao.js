import Product from "../models/Product.js"

class ProductDao {
    async getAll() {
        const products = await Product.find()
        return products
    }

    async getById(pid) {
        const product = await Product.findById(pid)
        return product
    }

    async create(data) {
        const product = await Product.create(data)
        return product
    }

    async update(pid, data) {
        const productUpdate = await Product.findByIdAndUpdate(pid, data, { new: true })
        return productUpdate
    }

    async deleteOne(pid) {
        const product = await Product.deleteOne({ _id: pid })
        return product
    }

    async getByName(name) {
        const product = await Product.findOne({ name })
        return product
    }
}

export const productDao = new ProductDao()