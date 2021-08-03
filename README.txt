How to use Safier?
1.Put your Combo in requirements/combo.txt and make sure the format is like this email:password
2.Put your HTTP proxies in requirements/proxies.txt(Make sure It's HTTP ONLY example: 51.195.203.3:8080)
3.Now Safier is good and ready to run.
4.Type node index.js in your CLI/Terminal.

Does Safier support capture?
Nope.

Is Safier multithreading?
Yes.

Where is Safier configs location?
at configs folder.
Config template:
{
    "config": {
        "name": "The name of the config",
        "back_name": "Config back name/domain the same kinda",
        "author": "Author of the config"
    },
    "checking": {
        "invalid_if_contain": ""If body contain this it will the account will be invalid.,
        "retry_if_contain": "If body contain checker will retry and change It's proxy.",
        "valid_if_contain": "If body contain this it will the account will be valid."
    },
    "api_link": "The API link/login link ot post.",
    "headers": {}, //Post Headers
    "body": "Body to send in post."
}

Where do valid/hit account go?
In results/hits.txt
