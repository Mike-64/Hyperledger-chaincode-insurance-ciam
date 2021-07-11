# Hyperledger-chaincode-insurance-claim

Vehicle Insurance Claim chaincode for the Hyperledger Fabric

## State Machine
Chaincode business logic can go through several states:
* No claim (invalid state)
* Claim Applied
* Claim rejected
* Coverage Estimation
* Estimation Agreement
* Claim Provisioned 

![Insurance Claim - State Diagram](https://user-images.githubusercontent.com/15845614/125208010-a1667c80-e2ad-11eb-9d55-addaa66eea62.png)


## Operations and allowed roles
Operation | Allowed roles
------------ | -------------
CreateClaim | PolicyHolder
getClaim | PolicyHolder, Adjuster, Insurance Company Manager
rejectClaim | Adjuster, Insurance Company Manager
coverageEstimation | Adjuster
estimationAgreement | PolicyHolder
provisionClaim | Insurance Company Manager