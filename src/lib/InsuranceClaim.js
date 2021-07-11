/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class InsuranceClaim extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        const claim = [
        {
            policyNumber:234234,
            vehicleDetails:{
                vehicleId:2,
                make:"Honda",
                year:2013,
                model:"Civic",
                owner:"Michael",
                licencePlateNo:"AST234"
            }
        },
        {
            policyNumber:285324,
            vehicleDetails:{
                vehicleId:6,
                make:"Ford",
                year:2016,
                model:"Mustang",
                owner:"Dave",
                licencePlateNo:"DVMT964"
            }
        },
        {
            policyNumber:354682,
            vehicleDetails:{
                vehicleId:8,
                make:"Nissan",
                year:2009,
                model:"Astra",
                owner:"Francis",
                licencePlateNo:"LK3678"
            }
        },
        {
            policyNumber:984651,
            vehicleDetails:{
                vehicleId:15,
                make:"Toyota",
                year:2019,
                model:"Prius",
                owner:"John",
                licencePlateNo:"AST234"
            }
        },      
    ]

        for (let i = 0; i < claim.length; i++) {
            policies[i].docType = 'claim';
            policies[i].status = 'Not Initialized'
            await ctx.stub.putState(claim[i].policyNumber, Buffer.from(JSON.stringify(claim[i])));
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    async createClaim(ctx,policyNumber,claimDetails){
        const role = ctx.clientIdentity.getAttributeValue(role);
        if(!role || role.length==0)
            throw new Error(`${role} does not exist`);
        if(role =='PolicyHolder'){        
        const claim = this.getClaim(ctx,policyNumber);
        claim.claimDetails = claimDetails
        claim.status = "Submitted";
        await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
        return true;
        }

    }
    
    async rejectClaim(ctx, policyNumber,RejectReason){
        const role = ctx.clientIdentity.getAttributeValue(role);
        if(!role || role.length==0)
            throw new Error(`${role} does not exist`);
        if(role =='Adjuster'){
            const claim = this.getClaim(ctx,policyNumber);
            claim.rejectionReason = RejectReason;
            claim.status = "closed";
            await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(claim)));
            return JSON.stringify(claim);
        }
        throw new Error(`${role} is not authorised to perform this operation`);
    }

    async coverageEstimation(ctx,policyNumber,estimation){
        const role = ctx.clientIdentity.getAttributeValue(role);
        if(!role || role.length==0)
            throw new Error(`${role} does not exist`);
        if(role =='Adjuster'||role==''){
            const claim = this.getClaim(ctx,policyNumber);
            claim.estimatedCoverage = estimation;
            claim.status = "awaiting agreement";
            await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(cliam)));
            return JSON.stringify(claim);
        }
        throw new Error(`${role} is not authorised to perform this operation`);
    }

    async estimationAgreement(ctx,policyNumber,decision){
        const role = ctx.clientIdentity.getAttributeValue(role);
        if(!role || role.length==0)
            throw new Error(`${role} does not exist`);
        if(role =='PolicyHolder'){
            const claim = this.getClaim(ctx,policyNumber);
            claim.estimatedCoverage = estimation;
            if(decision){
                claim.coverageAgreement = "Agreed";
                claim.status = "Processed";
            }else{
                claim.coverageAgreement = "Not Agreed";
                claim.status = "awaiting reevaluation"
            }
            
            await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(cliam)));
            return JSON.stringify(cliam);
        }
        throw new Error(`${role} is not authorised to perform this operation`);
    }

    async provisionClaim(ctx,policyNumber,coverageAmount){
        const role = ctx.clientIdentity.getAttributeValue(role);
        if(!role || role.length==0)
            throw new Error(`${role} does not exist`);
        if(role =='Insurance Company Manager'){
        const claimAsBytes = await ctx.stub.getState(policyNumber);
        const claim = this.getClaim(ctx,policyNumber);
        claim.provisionedCoverage = coverageAmount;
        calim.status = 'Provisioned';
        await ctx.stub.putState(policyNumber, Buffer.from(JSON.stringify(cliam)));
        return JSON.stringify(cliam);
        }
        throw new Error(`${role} is not authorised to perform this operation`);
    }

    async getClaim(ctx,policyNumber){
        const claimAsBytes = await ctx.stub.getState(policyNumber);
        if(!claimAsBytes || claimAsBytes.length==0){
            throw new Error(`${policyNumber} does not exist`);
        }
        const claim = JSON.parse(claimAsBytes.toString());
        return claim
    }


}

module.exports = InsuranceClaim;
