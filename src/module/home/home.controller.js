import {unlink} from "fs"
import path from "path";
import { isValidObjectId } from "mongoose";
import getItemFilter from "../../utils/api.feature.util.js";
import Home  from "./home.schema.js"
import { BadRequestsErr, NotFoundErr } from "../../exceptions/all.backend.exceptions.js";
import User from "../user/user.schema.js";


//create class home controller
class HomeController{
    #_homeModel
    #_userModel
    
    constructor(){
        this.#_homeModel = Home,
        this.#_userModel = User
    }
    getAllHomes = async(req,res,next)=>{
        try {
            
            const query = {...req.query};
            const allHomes = await new getItemFilter(
                this.#_homeModel.find(),
                query
              )
                .filter()
                .getQuery()
                .countDocuments();
        
                const allFilteredHomes = await new getItemFilter(
                    this.#_homeModel.find(),
                    query
                  )
                    .filter()
                    .paginate()
                    .sort("createdAt")
                    .getQuery();
       
                  res.send({
                    message: "success",
                    page: req.query?.page || 0,
                    limit: req.query?.limit || 10,
                    results: allHomes,
                    homes: allFilteredHomes,
                  });
                } catch (error) {
                  next(error);
                }
    }

    getOneHome = async(req,res,next)=>{
        try {
            const {id} = req.params
            this.#_checkValidObjectId(id)
            const query = {...req.query};
            const foundedHome = await new getItemFilter(this.#_homeModel.findOne({_id: id}),query).limitFields().getQuery().populate({path: "likes", select: "userId"})
            if(!foundedHome){
                throw new NotFoundErr(`Sorry, no homes were found for the {${id}} Object Id you provided`)
            }
            res.status(200).send({
                home: foundedHome
            })
        } catch (error) {
            next(error)
        }

    }

    createHome = async (req, res, next) => {
        try {
            const { userId,area,city,price, address, isBoys, roomsCount, bathRoomsCount, status, isWifi, additionalInformation, sellerPhoneNumber, isConditioner, isOwnerHouse } = req.body;
            const homeImage = req.files.map(file => file.filename);
            const newHome = await this.#_homeModel.create({
                userId,
                area,
                price,
                address,
                isBoys,
                roomsCount,
                bathRoomsCount,
                status,
                isWifi,
                additionalInformation,
                sellerPhoneNumber,
                isConditioner,
                isOwnerHouse,
                city,
                homeImage,
            
            });
            await this.#_userModel.findByIdAndUpdate(userId, {
                $push: { homes: newHome._id }
            });
    
            res.render("create-home.hbs",)
        } catch (error) {
            next(error);
        }
    };
    

    deleteHome = async(req,res,next)=>{
        try {
            const {id} = req.params
            console.log(id)
            this.#_checkValidObjectId(id)
            const foundedHome = await this.#_homeModel.findOne({_id: id})
            if(!foundedHome){
                throw new NotFoundErr(`Sorry, no homes were found for the {${id}} Object Id you provided`)
            }
            for(let item of foundedHome.homeImage ){
                unlink(path.join(process.cwd(),"uploads", item),(err)=>console.log(err))
            }
            await this.#_homeModel.findByIdAndDelete({_id: id})
            res.status(200).send({
                message: "succes deleted home",
            })
        } catch (error) {
            next(error)
        }
    }

    updateHome = async (req, res, next) => {
        try {
            const { id } = req.params;
            this.#_checkValidObjectId(id);
    
            const foundedHome = await this.#_homeModel.findOne({ _id: id });
            if (!foundedHome) {
                throw new NotFoundErr(`Sorry, no homes were found for the {${id}} Object Id you provided`);
            }
    
            const {
                area, price, address, isBoys, roomsCount,
                bathRoomsCount, status, isWifi, additionalInformation,
                sellerPhoneNumber, isConditioner, isOwnerHouse, city
            } = req.body;
    
            let updatingHomeImage = foundedHome.homeImage;
            if (req.files.length > 0) {
                if (updatingHomeImage && updatingHomeImage.length > 0) {
                    for (let currentImg of updatingHomeImage) {
                        const imgPath = path.join(process.cwd(), "uploads", currentImg.split("/")[5]);
                        unlink(imgPath, (err) => {
                            if (err) {
                                console.error(`Err: ${imgPath}`, err);
                            }
                        });
                    }
                }
                updatingHomeImage = req.files.map(file => file.filename);
            }
    
            const updates = {};
    
            if (area) updates.area = area;
            if (price) updates.price = price;
            if (address) updates.address = address;
            if (city) updates.city = city;
            if (typeof isBoys === 'boolean') updates.isBoys = isBoys;
            if (roomsCount) updates.roomsCount = roomsCount;
            if (bathRoomsCount) updates.bathRoomsCount = bathRoomsCount;
            if (status) updates.status = status;
            if (typeof isWifi === 'boolean') updates.isWifi = isWifi;
            if (additionalInformation) updates.additionalInformation = additionalInformation;
            if (sellerPhoneNumber) updates.sellerPhoneNumber = sellerPhoneNumber;
            if (typeof isConditioner === 'boolean') updates.isConditioner = isConditioner;
            if (typeof isOwnerHouse === 'boolean') updates.isOwnerHouse = isOwnerHouse;
            updates.homeImage = updatingHomeImage;
    
            await this.#_homeModel.updateOne({ _id: id }, {
                $set: updates
            });
    
            res.status(200).send({
                message: "Home updated successfully",
            });
        } catch (error) {
            next(error);
        }
    };
    
    
    
    
    #_checkValidObjectId = (id)=>{
        if(!isValidObjectId(id)){
            throw new BadRequestsErr(`The {${id}} id you provided is wrong`)
        }
    }
    
}

export default  new HomeController