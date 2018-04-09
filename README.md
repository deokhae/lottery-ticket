# API

Powerball is a popular US lottery game with draws twice a week.  For the purposes of this exercise, a Powerball lottery "ticket" includes one or more "picks".  Each "pick" is a set of 5 integers (from `1`-`69`) along with a 6th integer (the _Powerball_, from `1`-`26`) that the user has chosen to play during a specific draw. 

For example, a pick for the draw on `2017-11-09` might be: 

`02 14 19 21 61` `25`

The Powerball winning numbers change on each "draw date". In order to determine a win or a loss, the Powerball draw dates and winning numbers are retrieved from the following URL: 

https://games.api.lottery.com/api/v2.0/results?game=59bc2b6031947b9daf338d32

The prize is calculated as per the prize matrix image below: 

![](https://raw.githubusercontent.com/autolotto/interview/master/powerball_rules.png)


## Discoveries
* A missing subtlety is that whiteballs can not be duplicated in a draw. That has been handled here.
* It is also possible for a ticket to have two picks, exactly the same, that both win the jackpot. In that eventuality, the player splits the prize with themself i.e. they cannot get double the money. That tricky math has not been handled here.
* When querying for game results, it is crucial to use the **eTag**.


## Plea Bargains
* The code contains a few **TODO** statements for explanation of next steps or observations. That would be a "no-no" in real work.
* This API needs monitoring, especially of the job that queries for game results. Ideally, the job would be extracted into a proper worker of its own.


## Starting the App
From the checked-out application folder, run: 

`npm start` or `npm run start:watch` to autorun on changes.

You should see output like this: 

```
node index.js
App listening on port 3000
```

## Using the Endpoint
Try the following. Play around with removing keys or changing values to test the exhaustive validation.
```
curl -X "POST" "http://localhost:3000/check-ticket" \
     -H 'Content-Type: application/json' \
     -d $'{
  "picks": [
    {
      "powerBall": 24,
      "whiteBalls": [8, 24, 42, 54, 64]
    },
    {
      "powerBall": 24,
      "whiteBalls": [1, 2, 65, 9, 5]
    }
  ],
  "drawDate": "2018-04-05"
}'

```

Given that the draw for that date has white balls of `8, 24, 42, 54, 64` and a power ball of `24`, the player's ticket check response looks like the request but with additional annotations as follows.

```
{
  "picks": [
    {
      "powerBall": 24,
      "whiteBalls": [8, 24, 42, 54, 64],
      "prize": {
        "won": true,
        "amount": 60000000, 
        "powerBall": 24,
        "whiteBalls": [8, 24, 42, 54, 64]
      }
    },
    {
      "powerBall": 24,
      "whiteBalls": [1, 2, 65, 9, 5],
      "prize": {
        "won": true,
        "amount": 4,
        "powerBall": 24,
        "whiteBalls": null
      }
    }
  ],
  "drawDate": "2018-04-05",
  "summary": {
    "prizeTotal": 60000004,
    "errors": []
  }
}
```


## Testing
To run the existing (sample) tests simply use: 

`npm test` or `npm run test:watch` to autorun on changes.


 
