const mongoose = require('mongoose')
const validator = require('email-validator');
const removeImage = require('../util/removeImage');

const Product = require('../models/product.js').Product
const User = require('../models/user.js')
const deliveryDetails = require('../models/deliveryDetails')

exports.home = (req, res) => {

    let fname = '';

    Product.find((err, product_data) => {

        if (req.session.user) {

            for (let i = 0; i < req.session.user.name.length; i++) {

                fname += req.session.user.name[i]
                if (req.session.user.name[i] == ' ') break;
            }
        }
        res.render('index', { product_data: product_data })
    })
}
exports.details = (req, res) => {

    let flag = false;

    if (req.session.user) {
        for (let i = 0; i < req.session.user.wishlistItems.length; i++) {

            if (req.session.user.wishlistItems[i]._id.equals(req.params.id)) {

                flag = true;
                break;
            }
        }
    }
    let fname = '';
    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    Product.findOne({ _id: req.params.id }, (err, product) => {

        if (!product) {

            let errMsg = "Sorry, the requested product have been sold out!"

            console.log('mc');
            res.render('error', { errMsg });
            return;
        }
        console.log(flag)
        res.render('product_details', { product: product, flag: flag })
    })
}
exports.getAccount = (req, res, next) => {

    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    res.render('account');
}

exports.getCustomize = (req, res, next) => {

    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    res.render('customize');
}
exports.postCustomize = (req, res) => {

    const [name, email, material, desc, imageUrl] = req.body;
    const CustomizeRequestBody = `Name -> ${name}, Email -> ${email}, material -> ${material}, desc -> ${desc}`;


}

exports.getAdmin = (req, res, next) => {

    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    res.render('admin');
}

exports.getProduct = (req, res, next) => {
    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    Product.find()
        .then(prod => {
            // console.log(user);
            res.render('product', {
                product: prod
            });

        })
}
exports.getNewAddress = (req, res) => {

    res.render('addNewAddress')
}

exports.getEditProfile = (req, res, next) => {

    let fname = '';

    if (req.session.user) {

        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    res.render('editProfile', {
        user_name: req.session.user.name,
        name: req.session.user.name,
        email: req.session.user.email,
        phoneNo: req.session.user.phoneNo,
    });
}

exports.getEditPage = (req, res, next) => {
    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    const prodId = req.params.prodId;

    Product.findById(prodId)
        .then(prod => {
            res.render("editPage", {
                user_name: user_name,
                product: prod
            })
        })
        .catch(err => {
            console.log(err);
        })

}

exports.postEditPage = (req, res, next) => {
    const prodId = req.body.prodId;
    const name = req.body.name;
    const price = req.body.price;
    const pattern = req.body.pattern;
    const occasion = req.body.occasion;
    const fabric = req.body.fabric;
    const description = req.body.desc   ription;
    const image = req.file;

    Product.findById(prodId)
        .then(prod => {
            prod.name = name;
            prod.price = price;
            prod.pattern = pattern;
            prod.occasion = occasion;
            prod.fabric = fabric;
            prod.description = description;

            if (image) {
                removeImage.deleteFromFile(prod.imageUrl);
                prod.imageUrl = image.path;
            }

            return prod.save();
        })
        .then(data => {
            res.redirect('/product');
            console.log("data is updated");
        })
        .catch(err => {
            console.log(err);
        })
}

exports.postEditProfile = (req, res, next) => {
    const { name, email, phoneNo } = req.body;

    if (name.trim() === '') {
        console.log('fullName cannot be blank');
        res.render('editProfile', {
            error: 'nameErr',
            name: name,
            email: email,
            phoneNo: phoneNo
        })
        return;
    }

    console.log(phoneNo);
    // validating Mobile Number
    if (phoneNo.trim().length !== 10) {
        console.log('mobileNo is Invalid');
        res.render('editProfile', {
            error: 'mobErr',
            name: name,
            email: email,
            phoneNo: phoneNo
        })
        return;
    }

    // validating email
    if (!validator.validate(email)) {
        console.log('email is not correct');
        // res.redirect('/signup');
        res.render('editProfile', {
            error: 'emailErr',
            name: name,
            email: email,
            phoneNo: phoneNo
        })
        return;
    }

    req.session.user.email = email;
    req.session.user.name = name;
    req.session.user.phoneNo = phoneNo;

    req.session.user.save()
        .then(data => {
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        })

}


exports.postNewAddress = (req, res) => {

    const deliverydetails = new deliveryDetails({

        name: req.body.name,
        mobileNo: req.body.mobNumber,
        pincode: req.body.pincode,
        locality: req.body.locality,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        userId: req.session.user._id
    });
    deliverydetails.save()
        .then(res.redirect('/myAddress'))
        .catch((err) => console.log(err))
}
exports.getBuyNow = async (req, res, next) => {

    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    const product = await Product.findOne({ _id: req.params.id })

    deliveryDetails.find({ userId: req.session.user._id }, (err, data) => {

        res.render('addressDetail', { data: data, product: product })
    })
}
exports.getmyAddress = (req, res) => {

    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    deliveryDetails.find({ userId: req.session.user._id }, (err, data) => {

        console.log(data[0])
        res.render('myAdress', { data: data })
    })
}
exports.getCart = async (req, res) => {

    // const cartItems = [];
    // for (let i = 0; i < req.session.user.cartItems.length; i++) {

    //     const product = await Product.findOne({ _id: req.session.user.cartItems[i]._id })
    //     if (product) {
    //         cartItems.push(product);
    //     }
    //     // if (req.session.user.cartItems[i]._id.equals(product.id)) {

    //     //     req.session.user.cartItems.splice(i, 1)
    //     //     break
    //     // }
    // }
    // // console.log(cartItems);
    // req.session.user.cartItems = cartItems;

    // req.session.user.save()
    //     .then(() => {

    //     })
    //     .catch((err) => console.log(err))
    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    res.render('cart', { cartItems: req.session.user.cartItems });
}
exports.addToCart = (req, res) => {

    if (!req.session.user) {

        res.redirect('/login');
        return;
    }
    Product.findOne({ _id: req.body.id })
        .then(prod => {

            return prod;
        })
        .then(async (data) => {

            const user = await User.findOne({ _id: req.session.user._id })

            let flag = 1;

            for (let i = 0; i < user.cartItems.length; i++) {

                if (user.cartItems[i]._id.equals(data._id)) {

                    flag = 0
                    break
                }
            }
            if (flag === 1) {

                user.cartItems.push(data)
                user.save()
                    .then(() => console.log('Product successfully added two cart'))
                    .catch((err) => console.log(err))
            }
            res.redirect('/cart')
        })
        .catch(err => {
            console.log(err);
        })

}
exports.removeFromCart = async (req, res) => {

    for (let i = 0; i < req.session.user.cartItems.length; i++) {

        if (req.session.user.cartItems[i]._id.equals(req.body.productId)) {

            req.session.user.cartItems.splice(i, 1)
            break
        }
    }
    console.log(req.session.user.cartItems)
    req.session.user.save()
        .then(() => res.redirect('/cart'))
        .catch((err) => console.log(err))
}
exports.postAdminProd = (req, res, next) => {
    console.log(req.file);
    let store = req.file.path;
    console.log(req.file)
    console.log(store)
    // store=store.substr(6);

    const product = new Product({

        name: req.body.name,
        price: req.body.price,
        pattern: req.body.pattern,
        occasion: req.body.occasion,
        fabric: req.body.fabric,
        description: req.body.description,
        imageUrl: store,
    })
    product.save()
        .then(() => res.send("Product data saved successfully in the database"))
        .catch((err) => console.log(err))

}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.params.prodId;

    Product.findById(prodId)
        .then(prod => {
            return removeImage.deleteFromFile(prod.imageUrl);
        })
        .then(() => {
            return Product.findByIdAndRemove(prodId)
        })
        .then(() => {
            res.redirect('/product');
            console.log('deleted');
        })
        .catch(err => {
            console.log(err);
        })
}
exports.getWishlist = (req, res) => {

    let fname = '';

    if (req.session.user) {
        for (let i = 0; i < req.session.user.name.length; i++) {

            fname += req.session.user.name[i]
            if (req.session.user.name[i] == ' ') break;
        }
    }
    res.render('wishlist', { wishlistItems: req.session.user.wishlistItems });
}
exports.addToWishlist = async (req, res) => {

    if (!req.session.user) {

        res.redirect('/login');
        return;
    }
    console.log(req.body.wishlistToggle)

    if (req.body.wishlistToggle) {

        Product.findOne({ _id: req.body.id })
            .then(prod => {

                return prod;
            })
            .then(async (data) => {

                const user = await User.findOne({ _id: req.session.user._id })

                let flag = 1;

                for (let i = 0; i < user.wishlistItems.length; i++) {

                    if (user.wishlistItems[i]._id.equals(data._id)) {

                        flag = 0
                        break
                    }
                }
                if (flag === 1) {

                    user.wishlistItems.push(data)
                    user.save()
                        .then(() => console.log('Product successfully added two wislist'))
                        .catch((err) => console.log(err))
                }
                res.redirect('/product/' + req.body.id)
            })
            .catch(err => {
                console.log(err);
            })
    }
    else {

        for (let i = 0; i < req.session.user.wishlistItems.length; i++) {

            if (req.session.user.wishlistItems[i]._id.equals(req.body.id)) {

                console.log('isme aaya hai madharchod')
                req.session.user.wishlistItems.splice(i, 1)
                break
            }
        }
        req.session.user.save()
            .then(() => res.redirect('/product/' + req.body.id))
            .catch((err) => console.log(err))
    }
}
exports.removeFromWishlist = async (req, res) => {

    for (let i = 0; i < req.session.user.wishlistItems.length; i++) {

        if (req.session.user.wishlistItems[i]._id.equals(req.body.productId)) {

            req.session.user.wishlistItems.splice(i, 1)
            break
        }
    }
    console.log(req.session.user.wishlistItems)
    req.session.user.save()
        .then(() => res.redirect('/wishlist'))
        .catch((err) => console.log(err))
}
exports.search = (req, res) => {

    const regex = new RegExp(req.body.searchText, 'i');

    Product.find({ name: regex })
        .then(prod => {

            if (prod.length === 0) {

                errMsg = "No product found"
                res.render('error', { errMsg })
                return;
            }
            console.log('mc');
            console.log(prod)
            res.render('product', { product: prod, searchFlag: 1, searchText: req.body.searchText })
        })
}