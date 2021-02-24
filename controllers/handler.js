const catchAsync=require('./../utilities/asyncerror');
const AppError=require('./../utilities/apperror');


exports.deleteOneTour= Model => catchAsync(async (req, res,next) => {

    const find = await Model.findByIdAndDelete(req.params.id);
    // console.log(find);
    // if(find.length==0)console.log("Galat hai!")
    res.status(204).json({
      status: "success",
      data:null
    });
  
})