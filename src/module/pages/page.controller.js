class pageController {
    constructor(){}

    toHomes = async(req,res)=>{
        const response = await fetch(`http://127.0.0.1:8080/api/v1/homes`);
        const data = await response.json();
        res.render("index.hbs",data)
    }

    toLoginPage = (req,res)=>{
        res.render("login-index.hbs", { layout: "login-main"})
        
    }
    toCreateHome = (req,res)=>{
        res.render("create-home.hbs")
    }
    toSettingsUser = (_,res)=>{
        res.render("user-settings.hbs")
    }
    toSupport = (_,res)=>{
        res.render("support.hbs")
    }
    toMyHomes  = async(req,res)=>{
        const {userId} = req.params
        const response = await fetch(`http://127.0.0.1:8080/api/v1/users/${userId}`);
        const data = await response.json();
        res.render("my-homes.hbs",{homes: data.data.homes})
    }
    notFoundPage = (_,res)=>{
        res.render("404-index.hbs", {layout: "404.hbs"})
    }
    resetPassword = (req, res) => {
        res.render("reset-password.hbs", {
            token: req.params.token,
            layout: "password-reset-main.hbs"
        });
    };

    loginOTP = (_,res)=>{
        res.render("one-time-password.login.hbs", {layout: "password-reset-main.hbs"})
    }

    infoOneHome = async(req,res) =>{
        const {homeId} = req.params
        const response = await fetch(`http://127.0.0.1:8080/api/v1/homes/${homeId}`);
        const data = await response.json();
        res.render("info-all-home.hbs",{home: data})
    }

    ownerPage = async(req,res)=>{
        res.render("owner.dashboard.hbs", {layout: "owner-page.hbs"})
    }

    ownerUsersPage = async(req,res)=>{
        const response = await fetch(`http://127.0.0.1:8080/api/v1/users/`);
        const data = await response.json();
        res.render("owner-users.hbs",{users: data,test: "hi", layout: 'owner-page.hbs'})
    }

    ownerEditUser = async(req,res) =>{
        const {userId} = req.params
        const response = await fetch(`http://127.0.0.1:8080/api/v1/users/${userId}`);
        const data = await response.json();
        res.render("owner-users.hbs",{users: data, layout: 'owner-page.hbs'})
    }

    
}


export default  new pageController;