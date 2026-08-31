const categoryModel = require("../../Models/categoryModel");
const subcategoryModel = require("../../Models/subcategoryModel");
const subSubcategoryModel = require("../../Models/subSubcategoryModel");

const getMegaMenu = async (req, res) => {
    try {

        const categories = await categoryModel
            .find({ status: true })
            .sort({ order: 1 });

        const subcategories = await subcategoryModel
            .find({ status: true })
            .sort({ order: 1 });

        const subSubcategories = await subSubcategoryModel
            .find({ status: true })
            .sort({ order: 1 });


        const megaMenu = categories.map((category) => {

            const categorySubcategories = subcategories
                .filter((sub) =>
                    sub.parentCategory?.toString() ===
                    category._id.toString()
                )
                .map((sub) => {

                    const subSubcategoryList = subSubcategories
                        .filter((subSub) =>
                            subSub.subcategory?.toString() ===
                            sub._id.toString()
                        )
                        .map((subSub) => ({
                            _id: subSub._id,
                            name: subSub.name,
                            slug: subSub.slug,
                            
                            image: subSub.image,
                            order: subSub.order
                        }));


                    return {
                        _id: sub._id,
                        name: sub.name,
                        slug: sub.slug,
                        image: sub.image,
                        order: sub.order,
                        subSubcategories: subSubcategoryList
                    };

                });


            return {
                _id: category._id,
                name: category.name,
                slug: category.slug, // ADD THIS
                image: category.image,
                order: category.order,
                subcategories: categorySubcategories
            };

        });


        res.status(200).json({
            status: true,
            message: "Mega menu fetched successfully",
            data: megaMenu
        });


    } catch (error) {

        console.log("Mega Menu Error:", error);

        res.status(500).json({
            status: false,
            message: "Something went wrong",
            error: error.message
        });

    }
};


module.exports = {
    getMegaMenu
};