//map variables
var NavigateData = null;
var stateNameData ,Map = null;
var fontSize = 9;
var marginTop_dataLabel = 530;  
var marginLeft_dataLabel = 120;
var legendBox, legendLabel, legendHead,canvas,outlineMap,STATEDistrictName;
var StateMap = null;
var last_selected_opt = null;

var caveat_string_AP = "*The data shown is for Andhra Pradesh and Telangana combined";
var caveat_string_JSY = "*JSY : Janani Suraksha Yojana"

var infoBoxPopulationFontRatio = 2.3;



var lastAccess = null;


$(".top_nav").on('click',function(){
    if(lastAccess == null ){
        lastAccess = d3.select(this);
    }else{
        lastAccess.style('background','#FFCF1A');
        lastAccess = d3.select(this);
    }
    d3.select(this).style('background','#FFFFFF');
})

/*d3.select(window).on('resize',function(){
    if(prevHeight < height){

         {fontSize = 10*(   height/prevHeight);}

     }else if(prevHeight > height){

          {fontSize = 10*(height/prevHeight);}
     }else if(prevWidth < width){

         {fontSize = 10*(width/prevWidth);}
     }else if(prevWidth > width){

          {fontSize = 10*(width/prevWidth);}
     }
width = parseInt(d3.select('#chart-area').style('width'))
width = width - margin.left - margin.right;
height = width*mapRatio;

createState(currentStatePlot,currentCategoryPlot);

})*/

/* d3.select("#st_link").style('text-decoration','underline')
    d3.select("#ut_link").style('color','black')
    d3.select("#st_link").style('color','black')

$("#st_link").on('click',function(){
    d3.select(this).style('text-decoration','underline')
    d3.select("#ut_link").style('text-decoration','none')
})
$("#ut_link").on('click',function(){
    d3.select(this).style('text-decoration','underline')
    d3.select("#st_link").style('text-decoration','none')
})*/

fontSize = 9*(window.innerWidth)/screen.width

console.log("Getting with : " , screen.width +" : "+screen.availWidth +" : "+window.innerWidth)

var stateAPIData = null,STATEDistrictTopo=null,SaveData=null;

var MainHeading = d3.select('#main-head');

//Variables for dynamic Variable input and Map plot
var currentStatePlot = "India", currentCategoryPlot = "SC_AVL",apiVAR,plotVar;

//For Navigation control
//Adding/Removing the dropdown for state/India
var SCDrop = d3.select("#state-variable-sc");
var PHCDrop = d3.select("#state-variable-phc");
var CHCDrop = d3.select("#state-variable-chc");

//For disabling the Sub,Primary, Community centers link when in State Map, as they need to be used for drop downs here
var SCIndiaShortage = d3.select("#India-SC-shortage");
var PHCIndiaShortage = d3.select("#India-PHC-shortage");
var CHCIndiaShortage = d3.select("#India-CHC-shortage");


//Function to fetch the data from the search query link
var user_id=null,session_token = null;

var typeVar = 'SC';

//This is to re-structure the infromation box
$("#sub-info").addClass("col-border");
//$("#sub-info-box").show();

//To show the tabs on category nav and switch when the Index comes
$("#non_index_tabs").show();

/*$("#purchase").on('click',function(){
    window.location.href = "../webProduct/pricing.text?"+(window.location.search).substring(1);
})*/

var mySelectedVar;



//Hover functonality on "State" dropdowns
$("#StateDrop").on('mouseover',function(){
   
    $(this).trigger('click')
})

var PlotCategory = {
    p_jsy_anc : {
        reqVar : [
            {v : "p_jsy_anc"},
            {v : "var4"},
            {v : "var8"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_jsy_anc"
        },
        denom_head : "Total ANC Registrations",
        num_head : "Total JSY Registrations",
        plotType : "percent"
    },
    p_1trimester_anc : {
        reqVar : [
            {v : "p_1trimester_anc"},
            {v : "var4"},
            {v : "var6"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_1trimester_anc"
        },
        denom_head : "Total ANC Registrations",
        num_head : "Pregnant Women Registered in First Trimester",
        plotType : "percent"
    },
    p_3chkups_anc : {
        reqVar : [
            {v : "p_3chkups_anc"},
            {v : "var4"},
            {v : "var14"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_3chkups_anc"
        },
        denom_head : "Total ANC Registrations",
        num_head : "Pregnant Women Receiving 3 ANC Checkups",
        plotType : "percent"
    },
    p_100ifa_anc : {
        reqVar : [
            {v : "p_100ifa_anc"},
            {v : "var4"},
            {v : "var22"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_100ifa_anc"
        },
        denom_head : "Total ANC Registrations",
        num_head : "Pregnant Women Given 100 IFA",
        plotType : "percent"
    },
    p_inst_delivery : {
        reqVar : [
            {v : "p_inst_delivery"},
            {v : "var56"},
            {v : "var52"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_inst_delivery"
        },
        denom_head : "Total Reported Deliveries",
        num_head : "Institutional Deliveries",
        plotType : "percent"
    },
    p_safe_delivery : {
        reqVar : [
            {v : "p_safe_delivery"},
            {v : "var56"},
            {v : "safe_delivery_16_17"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_safe_delivery"
        },
        denom_head : "Total Reported Deliveries",
        num_head : "Total Safe Deliveries",
        plotType : "percent"
    },
    p_w48h_chkup_delivery : {
        reqVar : [
            {v : "p_w48h_chkup_delivery"},
            {v : "var56"},
            {v : "var82"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_w48h_chkup_delivery"
        },
        denom_head : "Total Reported Deliveries",
        num_head : "Post Partum Checkups within 48 hrs of Delivery",
        top_head : "Total Urban Population",
        plotType : "percent"
    },
    p_b48h14d_chkup_delivery : {
        reqVar : [
            {v : "p_b48h14d_chkup_delivery"},
            {v : "var56"},
            {v : "var84"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_b48h14d_chkup_delivery"
        },
        denom_head : "Total Reported Deliveries",
        num_head : "Post Partum Checkups from 48 hrs to 14 days of Delivery",
        top_head : "Total Urban Population",
        plotType : "percent"
    },
    p_tt2_anc : {
        reqVar : [
            {v : "p_tt2_anc"},
            {v : "var4"},
            {v : "var16"},
            {v : "n_urban_pop"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "p_tt2_anc"
        },
        denom_head : "Total ANC Registrations",
        num_head : "Pregnant Women received TT2 / Booster",
        top_head : "Total Urban Population",
        plotType : "percent"
    },
    SC_AVL : {
        reqVar :  [
            {v : "shortageSC"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"},
            {v : "desiredSC"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "shortageSC"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "DIST"
    },
    PHC_AVL : {
        reqVar : [
            {v : "shortagePHC"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"},
            {v : "desiredPHC"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "shortagePHC"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "DIST"
    },
    CHC_AVL : {
        reqVar :  [
            {v : "shortageCHC"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"},
            {v : "desiredCHC"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "shortageCHC"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "DIST"
    },
    SC_ACCESSIBILITY : {
        reqVar : [
            {v : "p_within5_SC"},
            {v : "n_villages"},
            {v : "SC_0"},
            {v : "SC_5"},
            {v : "SC_5_10"},
            {v : "SC_m_10"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "p_within5_SC"
        },
        denom_head : "Total Number of Villages",
        num_head : "Villages with access",
        top_head : "Total Urban Population",
        plotType : "percent"
    },
    PHC_ACCESSIBILITY : {
        reqVar : [
            {v : "p_within5_PHC"},
            {v : "n_villages"},
            {v : "PHC_0"},
            {v : "PHC_5"},
            {v : "PHC_5_10"},
            {v : "PHC_m_10"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "p_within5_PHC"
        },
        denom_head : "Total Number of Villages",
        num_head : "Villages with access",
        top_head : "Total Urban Population",
        plotType : "percent"
    },
    CHC_ACCESSIBILITY : {
        reqVar : [
            {v : "p_within10_CHC"},
            {v : "n_villages"},
            {v : "CHC_0"},
            {v : "CHC_5"},
            {v : "CHC_5_10"},
            {v : "CHC_m_10"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "p_within10_CHC"
        },
        denom_head : "Total Number of Villages",
        num_head : "Villages with access",
        top_head : "Total Urban Population",
        plotType : "percent"
    },
    SDH_AVL : {
        reqVar :  [
            {v : "totalSDH"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "totalSDH"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP"
    },
    DH_AVL : {
        reqVar :  [
            {v : "totalDH"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"},
            {v : "n_urban_pop"}
        ],
        plotVar : {
            v : "totalDH"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP"
    },
    CHC_QUALITY : {
        reqVar :  [
             {v : "chc_xray"},
             {v : "chc_radio"},
             {v : "chc_q_sply_doc"},
             {v : "chc_q_doc_in_q"},
             {v : "chc_ref_t"},
             {v : "chc_allop"},
             {v : "chc_ayush"},
             {v : "chc_func_lab"},
             {v : "chc_ot"},
             {v : "chc_lbr_room"},
             {v : "chc_new_born"},
             {v : "chc_30bed"},
             {v : "chc_total_spl"},
             {v : "chc_gen_duty"},
             {v : "phc_chc_pharma"},
             {v : "phc_chc_lab_tech"},
             {v : "phc_chc_nurse"}
        ],
        num : "chc_xray",
        hr : ['chc_total_spl','chc_gen_duty','phc_chc_pharma','phc_chc_lab_tech','phc_chc_nurse','chc_radio'],
        hr_label : ['All Specialists','General Duty Medical Officer','Pharmacists in PHC & CHC','Lab Technicians in PHC & CHC',' Nursing Staff in PHC & CHC','Shortage of Radiographers'],
        supply : ['chc_allop','chc_ayush'],
        supply_label : ['Allopathic Drugs for Common Ailments','AYUSH Drugs for Common Ailments'],
        infra : ['chc_xray','chc_q_sply_doc','chc_q_doc_in_q','chc_ref_t','chc_lbr_room','chc_new_born','chc_30bed','chc_ot','chc_func_lab'],
        infra_label : ['Functioning X-Ray Machines','Quarters for Specialits Doctors','Specialist Doctors Living in Quarters','Referal Transport Available','Functioning Labour Rooms','New Born Care Corners','at least 30 Beds','Functional Operational Theatres','Functional Labs'],
        plotVar : {
            v : "chc_xray"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP_QUALITY"
    },
    SC_QUALITY : {
        reqVar :  [
             {v : "sc_anm_q"},
             {v : "sc_anm_liv_q"},
             {v : "sc_reg_wtr"},
             {v : "sc_ele_sply"},
             {v : "sc_all_wth_r"},
             {v : "sc_health_f_work"},
             {v : "sc_health_m_work"}
        ],
        num : "sc_anm_q",
        hr : ['sc_health_f_work','sc_health_m_work'],
        hr_label : ['Female Health Workers/AMC','Male Health Workers/AMC'],
        infra : ['sc_anm_q','sc_anm_liv_q','sc_reg_wtr','sc_ele_sply','sc_all_wth_r'],
        infra_label : ['Without ANM Quarters','Without ANM living in ANM Quarters','Without Water Supply','Without Electricity Supply','Without All-Weather Road'],
        supply : [],
        supply_label : [],
        plotVar : {
            v : "sc_anm_q"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP_QUALITY"
    },
    PHC_QUALITY : {
        reqVar :  [
             {v : "phc_lbr_room"},
             {v : "phc_ot"},
             {v : "phc_4bed"},
             {v : "phc_ele_sply"},
             {v : "phc_reg_wtr"},
             {v : "phc_all_wth_road"},
             {v : "phc_comp"},
             {v : "phc_ref_trans"},
             {v : "phc_ayush"},
             {v : "phc_f_ass"},
             {v : "phc_m_ass"},
             {v : "phc_doc"},
             {v : "phc_lac_tech"},
             {v : "phc_pharma"},
             {v : "phc_lady_doc"},
             {v : "phc_chc_pharma"},
             {v : "phc_chc_lab_tech"},
             {v : "phc_chc_nurse"}
        ],
        num : "phc_ot",
        hr : ['phc_lac_tech','phc_pharma','phc_lady_doc','phc_f_ass','phc_m_ass','phc_doc'],
        hr_label : ['% of PHCs without Lab Technicians','% of PHCs without Pharmacists ','% of PHCs without Lady Doctors','Shortage of Female Health Assistance','Shortage of Male Health Assistance','Shortage of Doctors'],
        infra : ['phc_lbr_room','phc_ot','phc_4bed','phc_ele_sply','phc_reg_wtr','phc_all_wth_road','phc_comp','phc_ref_trans','phc_ayush'],
        infra_label : ['Without Labour Rooms','Without Operation Theatres','Without atleast 4 beds','Without Electricity Supply','Without Regular Water Supply','Without All Weather Road','Without Computers','Without Referral Transport','Without AYUSH Facility'],
        supply : [],
        supply_label : [],
        plotVar : {
            v : "phc_ot"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP_QUALITY"
    },
    SDH_QUALITY : {
        reqVar :  [
             {v : "sdh_doc"},
             {v : "sdh_para"},
        ],
        
        hr : ['sdh_doc','sdh_para'],
        hr_label : ['Doctors','Para Medics'],
        infra : [],
        infra_label : [],
        supply : [],
        supply_label : [],
        plotVar : {
            v : "sdh_doc"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP_QUALITY"
    },
    DH_QUALITY : {
        reqVar :  [
             {v : "dh_doc"},
             {v : "dh_para"},
        ],
        hr : ['dh_doc','dh_para'],
        hr_label : ['Doctors','Para Medics'],
        infra : [],
        infra_label : [],
        supply : [],
        supply_label : [],
        plotVar : {
            v : "dh_doc"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "NON_COMP_QUALITY"
    },
    QUALITY_INDEX : {
        reqVar :  [
            {v : "totalDH"},
            {v : "n_rural_pop"},
            {v : "n_rural_tr_pop"}
        ],
        plotVar : {
            v : "quality"
        },
        denom_head : "Total Rural Population",
        num_head : "Total Rural Tribal Population",
        top_head : "Total Urban Population",
        plotType : "QUALITY_INDEX"
    }
}

var plotVarDef = {
    "chc_xray" : {
        limit : {
        },
        description : {
            main_head : "Public Health Infrastructure Quality for Community Health Centre",
            category_head : "Shortage in Community Health Centre",
            leg_head : "",
            desc : ""
        }
    },
    "sc_anm_q" : {
        limit : {
        },
        description : {
            main_head : "Public Health Infrastructure Quality for Sub Centre",
            category_head : "Shortage in Sub Centre",
            leg_head : "",
            desc : ""
        }
    },
    "phc_ot" : {
        limit : {
        },
        description : {
            main_head : "Public Health Infrastructure Quality for Primary Health Centre",
            category_head : "",
            leg_head : "",
            desc : ""
        }
    },
    "sdh_doc" : {
        limit : {
        },
        description : {
            main_head : "Public Health Infrastructure Quality for Sub Divisional Hospitals",
            category_head : "Shortage in Sub Divisional Hospitals",
            leg_head : "",
            desc : ""
        }
    },
    "dh_doc" : {
        limit : {
        },
        description : {
            main_head : "Public Health Infrastructure Quality for District Hospitals",
            category_head : "Shortage in District Hospitals",
            leg_head : "",
            desc : ""
        }
    },
   "quality" : {
       limit : {
            l1 : {
                l : 1, r : 5 , c : "#045A8D" , head : ""
            },
            l2 : {
                l : 6, r : 10 , c : "#2B8CBE" , head : ""
            }, 
            l3 : {
                l : 11, r : 15 , c : "#FFC107" , head : ""
            },
            l4 : {
                l : 16, r : 21 , c : "#E65100" , head : ""
            }
        },
        description : {
            main_head : "Health Infrastructure Index",
            category_head : "% of District Hospitals",
            leg_head : "",
            desc : ""
        }
    },
    "SMALL_STATE" : {
       limit : {
            l1 : {
                l : 1, r : 2 , c : "#045A8D" , head : ""
            },
            l2 : {
                l : 3, r : 4 , c : "#2B8CBE" , head : ""
            }, 
            l3 : {
                l : 5, r : 7 , c : "#FFC107" , head : ""
            },
            l4 : {
                l : 8, r : 9 , c : "#E65100" , head : ""
            }
        },
        description : {
            main_head : "Health Infrastructure Index",
            category_head : "% of District Hospitals",
            leg_head : "",
            desc : ""
        }
    },
    "UT_STATE" : {
       limit : {
            l1 : {
                l : 1, r : 1 , c : "#045A8D" , head : ""
            },
            l2 : {
                l : 2, r : 3 , c : "#2B8CBE" , head : ""
            }, 
            l3 : {
                l : 4, r : 5 , c : "#FFC107" , head : ""
            },
            l4 : {
                l : 6, r : 6 , c : "#E65100" , head : ""
            }
        },
        description : {
            main_head : "Health Infrastructure Index",
            category_head : "% of District Hospitals",
            leg_head : "",
            desc : ""
        }
    },
    "p_jsy_anc" : {
        limit : {
            l1 : {
                l : 99, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 92, r : 99 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 55, r : 91 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 55 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "JSY to total ANC registrations",
            category_head : "",
            leg_head : "",
            desc : "Defines the Percentage of the Institiutional Deliveries"
        }
    },
    "p_1trimester_anc" : {
        limit : {
            l1 : {
                l : 85, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 72, r : 85 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 56, r : 71 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 56 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "First trimester registrations to total ANC registrations",
            category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the Institiutional deliveries"
        }
    },
    "p_3chkups_anc" : {
        limit : {
            l1 : {
                l : 93, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 85, r : 93 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 71, r : 84 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 71 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Pregnant women received 3 ANC check-ups to total ANC registrations",
             category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "p_100ifa_anc" : {
        limit : {
            l1 : {
                l : 92, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 85, r : 92 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 72, r : 84 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 72 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Pregnant women given 100 IFA to total ANC registrations",
            category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "p_inst_delivery" : {
        limit : {
            l1 : {
                l : 99, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 96, r : 99 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 85, r : 95 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 85 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Institutional deliveries to total reported deliveries",
             category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "p_safe_delivery" : {
        limit : {
            l1 : {
                l : 99, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 98, r : 99 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 89, r : 97 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 89 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Safe deliveries to total reported deliveries",
            category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "p_w48h_chkup_delivery" : {
        limit : {
            l1 : {
                l : 92, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 81, r : 92 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 65, r : 80 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 65 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Post-Partum check-up in <48 hrs of delivery to total reported deliveries",
            category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "p_b48h14d_chkup_delivery" : {
        limit : {
            l1 : {
                l : 92, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 62, r : 92 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 39, r : 61 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 39 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Post-Partum check-up within 2-14 days to total reported deliveries",
            category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "p_tt2_anc" : {
        limit : {
            l1 : {
                l : 93, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 88, r : 93 , c : "#2B8CBE" , head : "Above average"
            }, 
            l3 : {
                l : 78, r : 87 , c : "#FFC107" , head : "Below average"
            },
            l4 : {
                l : 0, r : 78 , c : "#E65100" , head : "Low"
            }
        },
        description : {
            main_head : "Pregnant women received TT2 or Booster to total ANC registrations",
             category_head : "",
            leg_head : "",
            desc : "Defines the percentage of the 3 ANC checkups"
        }
    },
    "shortageSC" : {
        limit : {
            l1 : {
                l : 0, r : 25 , c : "#045A8D" , head : 'Large Surplus'
            },
            l2 : {
                l : 25, r : 50 , c : "#2B8CBE" , head : "Surplus"
            },
            l3 : {
                l : 51, r : 75 , c : "#E65100" , head : "Shortage"
            },
            l4 : {
                l : 75, r : 100 , c : "#FFC107" , head : "Extreme Shortage"
            }   
        },
        description : {
            main_head : "Availability of Sub Centres",
             category_head : "",
            leg_head : "",
            desc : "Map to show the distribution of the sub centres across districts in state"
        }
    },"shortagePHC" : {
        limit : {
            l1 : {
                l : 0, r : 25 , c : "#045A8D" , head : 'Large Surplus'
            },
            l2 : {
                l : 25, r : 50 , c : "#2B8CBE" , head : "Surplus"
            },
            l3 : {
                l : 51, r : 75 , c : "#E65100" , head : "Shortage"
            },
            l4 : {
                l : 75, r : 100 , c : "#FFC107" , head : "Extreme Shortage"
            }   
        },
        description : {
            main_head : "Availability of Primary Health Centres",
             category_head : "",
            leg_head : "",
            desc : "Map to show the distribution of the Primary Health centres across districts in state"
        }
    },"shortageCHC" : {
       limit : {
            l1 : {
                l : 0, r : 25 , c : "#045A8D" , head : 'Large Surplus'
            },
            l2 : {
                l : 25, r : 50 , c : "#2B8CBE" , head : "Surplus"
            },
            l3 : {
                l : 51, r : 75 , c : "#E65100" , head : "Shortage"
            },
            l4 : {
                l : 75, r : 100 , c : "#FFC107" , head : "Extreme Shortage"
            }   
        },
        description : {
            main_head : "Availability of Community Health Centres",
            category_head : "",
            leg_head : "",
            desc : "Map to show the distribution of the Community Health centres across districts in state"
        }
    },
    "p_within5_SC" : {
        limit : {
            l1 : {
                l : 71, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 53, r : 71 , c : "#2B8CBE" ,head : "Above average"
            },
            l3 : {
                l : 40, r : 52 , c : "#FFC107" ,head : "Below average"
            },
            l4 : {
                l : 0, r : 40 , c : "#E65100" , head : "Low"
            }   
        },
        description : {
            main_head : "Villages with Access to Sub Centre within 5 km",
            category_head : "",
            leg_head : "",
            desc : "Map to show the accessibility of SC across districts"
        }
    },
    "p_within5_PHC" : {
       limit : {
            l1 : {
                l : 36, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 27, r : 36 , c : "#2B8CBE" ,head : "Above average"
            },
            l3 : {
                l : 18, r : 26 , c : "#FFC107" ,head : "Below average"
            },
            l4 : {
                l : 0, r : 18 , c : "#E65100" , head : "Low"
            }   
        },
        description : {
            main_head : "Villages with Access to Primary Health Centre within 5 km",
            category_head : "",
            leg_head : "",
            desc : "Map to show the accessibility of PHC across districts"
        }
    },
    "p_within10_CHC" : {
      limit : {
            l1 : {
                l : 59, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 43, r : 59 , c : "#2B8CBE" ,head : "Above average"
            },
            l3 : {
                l : 27, r : 42 , c : "#FFC107" ,head : "Below average"
            },
            l4 : {
                l : 0, r : 27 , c : "#E65100" , head : "Low"
            }   
        },
        description : {
            main_head : "Villages with Access to Community Health Centre within 10 km",
            category_head : "",
            leg_head : "",
            desc : "Map to show the accessibility of CHC across districts"
        }
    },
    "totalSDH" : {
      limit : {
            l1 : {
                l : 59, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 43, r : 59 , c : "#2B8CBE" ,head : "Above average"
            },
            l3 : {
                l : 27, r : 42 , c : "#FFC107" ,head : "Below average"
            },
            l4 : {
                l : 0, r : 27 , c : "#E65100" , head : "Low"
            }   
        },
        description : {
            main_head : "Availability of Sub Divisional Hospitals",
            category_head : "",
            leg_head : "",
            desc : ""
        }
    },
    "totalDH" : {
      limit : {
            l1 : {
                l : 59, r : 100 , c : "#045A8D" , head : "High"
            },
            l2 : {
                l : 43, r : 59 , c : "#2B8CBE" ,head : "Above average"
            },
            l3 : {
                l : 27, r : 42 , c : "#FFC107" ,head : "Below average"
            },
            l4 : {
                l : 0, r : 27 , c : "#E65100" , head : "Low"
            }   
        },
        description : {
            main_head : "Availability of District Hospitals",
            category_head : "",
            leg_head : "",
            desc : ""
        }
    }
}

var StateCodeObject = {
 "A & N Islands" : 35,
 "Andaman & Nicobar Island" : 35,
 "Andhra Pradesh" :  37,
 "Arunanchal Pradesh" : 12,
 "Arunachal Pradesh" : 12,
 "Assam"  : 18,
 "Bihar"  : 10,
 "Chandigarh"  : 04,
 "Chhattisgarh" : 22,
 "Dadra & Nagar Haveli" : 26,
 "Daman & Diu" : 25,
 "NCT of Delhi" :  07,
 "Delhi" :  07,
 "Goa" : 30 ,
 "Gujarat" :24 ,
 "Haryana" : 06 ,
 "Himachal Pradesh" :  02 ,
 "Jammu & Kashmir"  : 01 ,
 "Jharkhand"  : 20 ,
 "Karnataka" :  29 ,
 "Kerala" :  32 ,
 "Lakshadweep" :  31 ,
 "Madhya Pradesh" :  23 ,
 "Maharashtra" :  27 ,
 "Manipur" :  14 ,
 "Meghalaya" :  17 ,
 "Mizoram" :  15 ,
 "Nagaland"  : 13 ,
 "Odisha" : 21 ,
 "Pondicherry"  : 34 ,
 "Punjab" :  03 ,
 "Rajasthan" : 08 ,
 "Sikkim" :  11 ,
 "Tamil Nadu" :  33 ,
 "Telangana" :  36,
 "Tripura" :  16 ,
 "Uttar Pradesh" :  09 ,
 "Uttarakhand"  : 05 ,
 "West Bengal" :  19,
 "Puducherry" : 35
}

plotMap(2)
function plotMap(geoCode,stateCode,MapCode){
    
    /*cleanup the area for the new map to be plotted*/
    MainHeading.text("Generating Map ...")
    d3.select("#legHead").text('');
    if(Map) Map.remove();
    if(canvas) canvas.remove();
    if(legendHead) legendHead.text("")
    d3.select('#CHC-LABEL').text("")
    if(outlineMap) outlineMap.remove();
    
    
    if(geoCode == 1){
        //console.log('plotMap : Plotting India')
        createNewIndiaMap();
    }else if(geoCode ==2){
        //console.log('plotMap : Plotting States')
        if(stateCode == null || MapCode == null)
        {
            generateStates("India",'PHC_AVL');
        }else{
            
            generateStates(stateCode,MapCode);
        }
    }
}

//loading the file that stores geoMercator(geolocation) and CSV file link for various states
d3.json('../json/loadstate.json',function(err,data){
    if(err){
           } 
    else{
       NavigateData = data;
      }
});


function generateStates(stateCallCode,mapCallCode){

        //Defining the variables for loading the file
        var STATE;
        var DATA_FILE_LOCATION;
        var GEOM_WIDTH_R;
        var GEOM_HEIGHT_R;
        var GEOM_SCALE_R;
        var FUNCTION_CALLL;
    
        var stateFont = 9;
        var StandardHeight = 140;
    
        //Changing the functionalities for the state and India map
        SCDrop.style('visibility','visible')
        PHCDrop.style('visibility','visible')
        CHCDrop.style('visibility','visible')
        SCIndiaShortage.on('click',function(){})
        PHCIndiaShortage.on('click',function(){})
        CHCIndiaShortage.on('click',function(){})
        SCIndiaShortage.on('mouseover',function(){
            
            $(this).trigger('click')
        })
        PHCIndiaShortage.on('mouseover',function(){
            
          $(this).trigger('click')
        })
        CHCIndiaShortage.on('mouseover',function(){
            
          $(this).trigger('click')
        })
        /***************************/

    
        $(".STATE_DROPDOWN_SELECT").on('click',function(){
            
            $("#legHead").hide()
             //This is to re-structure the infromation box
            if(currentCategoryPlot.substr(currentCategoryPlot.indexOf("_")+1) == 'QUALITY'){
                $("#sub-info").removeClass("col-border");
                $("#sub-info").hide();
                $("#sub-info-q").show();
            }else{
                $("#sub-info").addClass("col-border");
                $("#sub-info").show();
                $("#sub-info-q").hide();
            }
            
            $("#sub-info").addClass("col-border");
            $("#sub-info").show();
            $("#sub-info-q").hide();
            
            //Changing the size of the No.of Hospital
            InfoExistingLabel.style("font-size","15px")
            InfoExisting.style("font-size","20px")
            
            //Hiding the comming soon if data present
            $("#comming_soon").hide();
            
            currentStatePlot = $(this).attr('id');
            hideXtra()
            if(currentStatePlot == 'India' && PlotCategory[currentCategoryPlot].plotType == "NON_COMP_QUALITY"){
                
                //District Maps not available right now for any Quality
                //So Nothing here
                MainHeading.text("Generating Map ...")
                currentCategoryPlot = currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1)+"AVL"
                $("#HR").hide()
                $("#INFRA").hide()
                $("#SUPPLY").hide()
                
            }else if(currentStatePlot == 'India' && currentCategoryPlot.substr(currentCategoryPlot.indexOf("_")+1) == 'QUALITY'){
                
                //District Maps not available right now for any Quality
                //So Nothing here
                MainHeading.text("Generating Map ...")
                console.log("Calling India with SC_AVL: ", currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1)+"AVL")
                currentCategoryPlot = currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1)+"AVL"
                $("#HR").hide()
                $("#INFRA").hide()
                $("#SUPPLY").hide()
                //createState(currentStatePlot,currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1)+"AVL"); 
               
            }else if(currentCategoryPlot == "QUALITY_INDEX"){
                     
                $("#legends").show();
                
            }else if($(this).attr('id') == 'India'){
                
                $("#tooltip-area").show();
                $("#table-area").hide(); 
                $("#legends").show();
                
                $("#HR").hide()
                $("#INFRA").hide()
                $("#SUPPLY").hide()
                
                MainHeading.text("Generating Map ...")
                console.log("India Map is called !!")
                create('India',FUNCTION_CALLL)
            }else{
                
                $("#HR").show()
                $("#INFRA").show()
                $("#SUPPLY").show()
                
                $("#tooltip-area").show();
                $("#table-area").hide(); 
                $("#legends").show();
                
                MainHeading.text("Generating Map ...")
                createState(currentStatePlot,currentCategoryPlot);  
                if(currentStatePlot == 'Andhra Pradesh'){
                    var info = d3.select("#INFO-CAVEAT").text();
                    if(info.indexOf(caveat_string_AP) == -1){
                        d3.select("#INFO-CAVEAT").text(info +" " + caveat_string_AP);
                    }
                }else{
                    var info = d3.select("#INFO-CAVEAT").text();
                    d3.select("#INFO-CAVEAT").text(info + "");
                }
                
            }    
           
            createState(currentStatePlot,currentCategoryPlot); 
          
            
        })
    
        $(".CATEGORY_DROPDOWN_SELECT").on('click',function(){
            
            $("#legHead").hide()
            
            $("#sub-info").addClass("col-border");
            $("#sub-info").show();
            $("#sub-info-q").hide();
            
            
            
            //This is to re-structure the infromation box
            if(currentCategoryPlot.substr(currentCategoryPlot.indexOf("_")+1) == 'QUALITY'){
                $("#sub-info").hide();
                $("#sub-info").removeClass("col-border");
                $("#sub-info-q").show();
                $("#legends").hide();
            }else{
               $("#sub-info").show();
                $("#sub-info").addClass("col-border");
                $("#sub-info-q").hide();
                $("#legends").show();
            }
            
           
            
            //Changing the size of the No.of Hospital
            InfoExistingLabel.style("font-size","15px")
            InfoExisting.style("font-size","20px")
            
            //Hiding the comming soon if data present
            $("#comming_soon").hide();
            
            console.log("This is the ID received ",$(this).attr('id'))
            currentCategoryPlot = $(this).attr('id');
            hideXtra();
            $("#legends").show();
            
            if($(this).attr('name') == 'MET_CARE'){
                $(".SUB_CATEGORY_DROPDOWN_SELECT").hide();
            }else if($(this).attr('name') == 'QLTY_INDX'){
                $("#legends").show();
                
            }
            else{
                
                $(".SUB_CATEGORY_DROPDOWN_SELECT").show();
                if(currentCategoryPlot == 'SDH_AVL' || currentCategoryPlot == 'DH_AVL'){
                    $("#ACCESSIBILITY").hide()
                }
                else{
                    $("#ACCESSIBILITY").show()
                }
            }
            
            if(currentCategoryPlot == 'p_jsy_anc'){
                
                    $("#tooltip-area").show();
                    $("#table-area").hide();  
                    $("#legends").show();
                
                    MainHeading.text("Generating Map ...")
                    
                    var info = d3.select("#INFO-CAVEAT").text();
                    if(info.indexOf(caveat_string_JSY) == -1){
                        d3.select("#INFO-CAVEAT").text(info +" " + caveat_string_JSY);
                    }
            }else if(currentStatePlot == 'India' && (currentCategoryPlot == 'SDH_AVL' || currentCategoryPlot == 'DH_AVL') ){

                        MainHeading.text("Generating Map ...")
                      
                        currentCategoryPlot = currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1)+"AVL"
                        $("#HR").hide()
                        $("#INFRA").hide()
                        $("#SUPPLY").hide()
                       

                    }else if(PlotCategory[currentCategoryPlot].plotType == "QUALITY_INDEX"){
                    $("#tooltip-area").hide();
                    $("#table-area").show();
                    $("#legends").hide();
                
                    MainHeading.text("Generating Map ...")
                    var info = d3.select("#INFO-CAVEAT").text();
                    d3.select("#INFO-CAVEAT").text(info + "");
            }else{
                
                   
                
                    $("#tooltip-area").show();
                    $("#table-area").hide();
                    $("#legends").show();
                
                    MainHeading.text("Generating Map ...")
                    var info = d3.select("#INFO-CAVEAT").text();
                    d3.select("#INFO-CAVEAT").text(info + "");
            }
            
            if(currentCategoryPlot == "QUALITY_INDEX"){
                $("#index_tabs").show();
                $("#non_index_tabs").hide();
            }else{
                $("#index_tabs").hide();
                $("#non_index_tabs").show();
            }
            
            if(currentStatePlot == 'Andhra Pradesh'){
                    var info = d3.select("#INFO-CAVEAT").text();
                    if(info.indexOf(caveat_string_AP) == -1){
                        d3.select("#INFO-CAVEAT").text(info +" " + caveat_string_AP);
                    }
            }else{
                var info = d3.select("#INFO-CAVEAT").text();
                d3.select("#INFO-CAVEAT").text(info + "");
            }
            
            
            createState(currentStatePlot,currentCategoryPlot); 
           
               
        })
    
        $(".SUB_CATEGORY_DROPDOWN_SELECT").on('click',function(){
            
            //Hiding the comming soon if data present
            $("#comming_soon").hide();
            
            
            /*if(last_selected_opt != null){
                d3.select("#"+last_selected_opt).style('text-decoration','none')
            }
            d3.select("#"+$(this).attr('id')).style('text-decoration','underline')
            last_selected_opt = $(this).attr('id');*/
            
            //Changing the size of the No.of Hospital
            InfoExistingLabel.style("font-size","15px");
            InfoExisting.style("font-size","20px");
            
            console.log("This is the ID received ",$(this).attr('id'));
            if( $(this).attr('id') == 'AVL' || $(this).attr('id') == 'ACCESSIBILITY'){
                currentCategoryPlot = currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1) +$(this).attr('id');
            }else{
                currentCategoryPlot = currentCategoryPlot.substr(0,currentCategoryPlot.indexOf("_")+1) +"QUALITY";
                typeVar = $(this).attr('id');
            }
            
            hideXtra()
            console.log("This is selection 2",currentCategoryPlot);
            
            if(currentStatePlot == 'India' && PlotCategory[currentCategoryPlot].plotType == "NON_COMP_QUALITY"){
                
                //District Maps not available right now for any Quality
                //So Nothing here
                
            }else{
                
                $("#tooltip-area").show();
                $("#table-area").hide();
                $("#legends").show();

                MainHeading.text("Generating Map ...")
                var info = d3.select("#INFO-CAVEAT").text();
                d3.select("#INFO-CAVEAT").text(info + "");
            }
            
            //This is to re-structure the infromation box
            if(currentCategoryPlot.substr(currentCategoryPlot.indexOf("_")+1) == 'QUALITY'){
                $("#sub-info").hide();
                $("#sub-info").removeClass("col-border");
                $("#sub-info-q").show();
                $("#legends").hide();
            }else{
               $("#sub-info").show();
                $("#sub-info").addClass("col-border");
                $("#sub-info-q").hide();
                $("#legends").show();
            }
            
            if(currentStatePlot == 'Andhra Pradesh'){
                var info = d3.select("#INFO-CAVEAT").text();
                if(info.indexOf(caveat_string_AP) == -1){
                        d3.select("#INFO-CAVEAT").text(info +" " + caveat_string_AP);
                }
                $("#INFO-CAVEAT").show()
            }else{
                var info = d3.select("#INFO-CAVEAT").text();
                d3.select("#INFO-CAVEAT").text(info + "");
                 $("#INFO-CAVEAT").hide()
            }
            
            createState(currentStatePlot,currentCategoryPlot); 
            
        })
    
        // Handeling the Index select
        $(".INDEX_CATEGORY_DROPDOWN_SELECT").on('click',function(){
            
                  MainHeading.text("Generating Map ...");
            
                  //Change for Index Show up
                 
                  $("#non_index_tabs").hide();
                  $("#tooltip-area").hide();
                  $("#table-area").show();
                  $("#legends").hide();

                  
                  var info = d3.select("#INFO-CAVEAT").text();
                  d3.select("#INFO-CAVEAT").text(info + "");
                     
                  index_plot = $(this).attr('id');
                  console.log("This is the index : ",index_plot)
                     
                if($(this).attr('id') == 'INFRA_INDEX'){
                    MainHeading.text("Generating Map ...")
                    $("#index_tabs").show();
                    $("#legends").show();     
                    $("#table-area").show();
                    var info = d3.select("#INFO-CAVEAT").text();
                    d3.select("#INFO-CAVEAT").text(info + "");

                    $("#main-head").text("Health Infrastructure Index : INDIA")
                    

                }else if($(this).attr('id') == 'MET_INDEX'){
                    MainHeading.text("Generating Map ...")
                    $("#legends").hide();
                    $("#table-area").hide();
                    $("#index_tabs").hide();
                    //outlineMap.style('fill','#74A9CF')
                    $("#main-head").text("Maternal Health Index : INDIA")

                }else if($(this).attr('id') == 'CHILD_CARE_INDEX'){
                    MainHeading.text("Generating Map ...")
                    $("#legends").hide();
                    $("#table-area").hide();
                    $("#index_tabs").hide();    
                    //outlineMap.style('fill','#74A9CF')
                    $("#main-head").text("Child Health Index : INDIA")

                }else if($(this).attr('id') == 'COMM_DIS_INDEX'){
                    MainHeading.text("Generating Map ...")
                    
                    $("#legends").hide();
                    $("#table-area").hide();
                    $("#index_tabs").hide();
                    //outlineMap.style('fill','#74A9CF')

                   MainHeading.text("Communicable Disease Index")

                }else if($(this).attr('id') == 'NON_COMM_DIS_INDEX'){

                    MainHeading.text("Generating Map ...")
                    $("#legends").hide();
                    $("#table-area").hide();
                    $("#index_tabs").hide();
                    //outlineMap.style('fill','#74A9CF')
                    $("#main-head").text("Non Communicable Diseases Index : INDIA")

                }else if($(this).attr('id') == 'GEN_INDEX'){

                    MainHeading.text("Generating Map ...")
                    $("#legends").hide();
                    $("#table-area").hide();
                    $("#index_tabs").hide();
                    //outlineMap.style('fill','#74A9CF')
                    $("#main-head").text("General Health Index : INDIA")
                }
                     
                    console.log('Plottng the Index')
                    currentStatePlot = 'India_state';
                    currentCategoryPlot = 'QUALITY_INDEX';
                    createState(currentStatePlot,currentCategoryPlot);
                })
    
       if(stateCallCode == null){
           createState("Assam",'PHC_AVL');
       }else{
           createState(stateCallCode,mapCallCode);
       }
    
        //To enable only single click on the India Map button
        $("#IndiaBtn").attr("disabled", false);
        d3.select("#IndiaBtn").on('click',function(){
            
            plotMap(1);
            $(this).attr("disabled", true);
        })

       function createState(stateCall,functionCall){
            
            if(NavigateData!=null){
                
                     //console.log(NavigateData[STATE].DATA_FILE_LOCATION)
                     
                     STATE = stateCall;
                     if(stateCall == 'India_state'){
                         STATE = 'India';
                     }
                     DATA_FILE_LOCATION = NavigateData[STATE].DATA_FILE_LOCATION;
                     GEOM_WIDTH_R = NavigateData[STATE].GEOM_WIDTH_R.m1*NavigateData[STATE].GEOM_WIDTH_R.m2;
                     GEOM_HEIGHT_R = NavigateData[STATE].GEOM_HEIGHT_R.m1*NavigateData[STATE].GEOM_HEIGHT_R.m2;
                     GEOM_SCALE_R = NavigateData[STATE].GEOM_SCALE_R.m1*NavigateData[STATE].GEOM_SCALE_R.m2;
                     FUNCTION_CALLL = currentCategoryPlot;

                     if(canvas) canvas.remove();
                     canvas = null;
                     if(outlineMap) outlineMap.remove();
                     outlineMap = null;
                     if(STATEDistrictName) STATEDistrictName.remove();
                     STATEDistrictName = null;
                     console.log("Call Function")
                     create(stateCall,FUNCTION_CALLL);
             }else{
                     STATE = currentStatePlot;
                     DATA_FILE_LOCATION = 'data/as.csv';
                     GEOM_WIDTH_R = 8*2.27/2;
                     GEOM_HEIGHT_R = 4*(2.49)/2;
                     GEOM_SCALE_R = 5.2*(1.140);
                     FUNCTION_CALLL = currentCategoryPlot;

                     if(canvas) canvas.remove();
                     canvas = null;
                     if(outlineMap) outlineMap.remove();
                     outlineMap = null;
                     if(STATEDistrictName) STATEDistrictName.remove();
                     STATEDistrictName = null
                     create(stateCall,FUNCTION_CALLL);
             }
             
        }
        var current = function(){};
        var prevWidth = null , prevHeight = null;
        var margin = {
            top : 10,
            bottom : 10,
            left : 10,
            right : 10
        }
        
        var width = parseInt(d3.select('#chart-area').style('width'))
            width = width - margin.left - margin.right;
        prevWidth = width;
        var mapRatio = 0.62;
        var height = width*mapRatio;
        prevHeight = height;
        
        var tooltipArea = d3.select("#tooltip-area")
                            tooltipArea.style('height',height+'px');
                            $("#tooltip-area").show()
        var dataTable = d3.select("#table-area").style('height',height+'px');
                            dataTable.style('height',height+'px');
        $("#legends").show();

        var projectionState,pathState;
        
        var legendsData = d3.select("#legends");
        legendsData.style('visibility','hidden')
        
        
        
        //Setting the map navigation
        var SCSTATEInfo = d3.select("#STATE-SC-shortage");
        var PHCSTATEInfo = d3.select("#STATE-PHC-shortage");
        var CHCSTATEInfo = d3.select("#STATE-CHC-shortage");
        
        var SCSTATEInfo16 = d3.select("#STATE-SC-shortage_2016");
        var PHCSTATEInfo16 = d3.select("#STATE-PHC-shortage_2016");
        var CHCSTATEInfo16 = d3.select("#STATE-CHC-shortage_2016");
        
        var SCSTATEAccess = d3.select("#STATE-SC-access");
        var PHCSTATEAccess  = d3.select("#STATE-PHC-access");
        var CHCSTATEAccess  = d3.select("#STATE-CHC-access");
        
        var InfoStateName = d3.select("#STATE-HEAD");
        var InfoRuralPopulation = d3.select("#RURAL-POPULATION");
        var InfoUrbanPopulation = d3.select("#URBAN-POPULATION");
        var InfoUrbanPopulationHead = d3.select("#URBP");
        var InfoRuralTribalPopulation = d3.select("#RURAL-TRIBAL-POPULATION");
        var InfoHealthCategoryName = d3.select("#CATEGORY-HEAD");
        var InfoExisting = d3.select("#EXISTING");
        var InfoRequired = d3.select("#REQUIRED");
        var InfoShortage = d3.select("#SHORTAGE");
        InfoShortage.style("background","#fff")
        var InfoShortageLabel = d3.select("#SHORTAGE-LABEL");
        var InfoExistingLabel = d3.select("#EXISTING-LABLE");
        var InfoRequiredLabel = d3.select("#REQUIRED-LABLE");

        
        
        
        //Defining the legends
        var color_SHC_shortage_STATE_2011 = ['#045A8D','#2B8CBE','#FFC107','#E65100']
        var label_SHC_shortage_STATE_2011 = ['Large Surplus (30-150)','Surplus (0-29)','Shortage (1-150)','Extreme Shortage ( >150)'];
        
        var color_PHC_shortage_STATE_2011 = ['#045A8D','#2B8CBE','#FFC107','#E65100'];
        var label_PHC_shortage_STATE_2011 = ['Large Surplus (10-35)','Surplus (0-9)','Shortage (1-40)','Extreme Shortage ( >40)'];
            
        var color_CHC_shortage_STATE_2011 = ['#045A8D','#2B8CBE','#FFC107','#E65100'];
        var label_CHC_shortage_STATE_2011 = ['Large Surplus (100-220)','Surplus (0-99)','Shortage (1-5)','Extreme Shortage ( >5)'];
        
        var colorAccessSubCenter_STATE_gt_5km = ['#E65100','#FFC107','#2B8CBE','#045A8D','#fff'];
        var LabelAccessSubCenter_STATE_gt_5km = ['< 25','26-50','51-60','>60','No Data'];
        
        var colorAccessPHC_STATE_gt_5km = ['#E65100','#FFC107','#2B8CBE','#045A8D','#fff'];
        var LabelAccessPHC_STATE_gt_5km = ['< 25','26-50','51-60','>60','No Data'];
        
        var colorAccessCHC_STATE_gt_5km = ['#E65100','#FFC107','#2B8CBE','#045A8D','#fff'];
        var LabelAccessCHC_STATE_gt_5km = ['< 25','26-50','51-60','>60','No Data'];
    
       $(window).on('resize',function (){
           //alert("Resizing !!")
            /* if(window.width < 500){
                
            }else if(prevHeight*3/4 >= height || prevHeight*3/4 <= height || prevWidth*3/4 >= width || prevWidth*3/4 <= width){
                
                 if(prevHeight < height){
                    
                     {fontSize = 9;}
                    
                 }else if(prevHeight > height){
                     
                      {fontSize = 4.5;}
                 }else if(prevWidth < width){
                     
                     {fontSize = 9;}
                 }else if(prevWidth > width){
                     
                      {fontSize = 4.5;}
                 }
                 
                 ////console.log(fontSize)
                 margin = {
                    top : margin.top*3/4,
                    bottom : margin.bottom*3/4,
                    left : margin.left*3/4,
                    right : margin.right*3/4
                }
                
                MainHeading.text("Generating map...")
                 
                 prevWidth = width;
                 
                 prevHeight = height;
                
                 if(canvas) canvas.remove();
                 canvas = null;
                 if(outlineMap) outlineMap.remove();
                 outlineMap = null;
                 if(STATEDistrictName) STATEDistrictName.remove();
                 STATEDistrictName = null;
                
                 prevHeight = height;
                 prevWidth = width;
                
                  projectionState = d3.geo.mercator()
                              .translate([-width*GEOM_WIDTH_R, height*GEOM_HEIGHT_R])
                              .scale([width*GEOM_SCALE_R]);
                  pathState = d3.geo.path().projection(projectionState);
                
                 
                 d3.select(this).transition().delay(500).each('end',function(){
                     current();
                 }) 
                
            }*/
       })
        
        
       
       function create(stateNameCall,categoryCall){
           
        stateAPIData = null,STATEDistrictTopo=null;
           
        console.log(stateNameCall +" :  " + categoryCall)
           
        /*Reframing the colors*/
        if(InfoExisting) InfoExisting.style('color','black')
        if(InfoRequired) InfoRequired.style('color','black')
        if(InfoShortage) InfoShortage.style('color','black')
        
        apiVAR = [];
        //Creating the data_vars for the API
        PlotCategory[categoryCall].reqVar.forEach(function(d){
           
            var obj = {
                "data_var" : d.v
            }
            apiVAR.push(obj)
        })
        
        plotVar = PlotCategory[categoryCall].plotVar;
        
        if(PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY"){
           
            //Asynchronous download of the data :: District TopoJson ; APICallData 
            d3.json('../geojson/indianewmaptopo.json',function(error,data){
                console.log("Topo Data downloaded")
                console.log(data)
                STATEDistrictTopo = data;
                callReady();
            })
            
        }else if(stateNameCall == 'India_state' || PlotCategory[categoryCall].plotType == "QUALITY_INDEX"){

                  
                    d3.json('../geojson/indianewmaptopo.json',function(error,data){
                       
                        STATEDistrictTopo = data;
                        callReady();
                    })

       }else{
            
            //Asynchronous download of the data :: District TopoJson ; APICallData 
            d3.json('../geojson/2011_dist_topojson.json',function(error,data){
                console.log("Topo Data downloaded")
                STATEDistrictTopo = data;
                callReady();
            })
            
        }
           
        if( PlotCategory[categoryCall].plotType == "QUALITY_INDEX" ){
             
              $.ajax({
              type: 'POST',
              url: 'https://mycol.io:8080/index',
              withCredentials:true,
              data: {},
              dataType: "json",
              success: function(resultData) { 
                  
                  if(resultData.status == 'success'){
                      console.log(resultData)
                      
                      console.log("API Data downloaded")
                      stateAPIData = resultData.message;
                      callReady();
                  }else{
                     console.log(resultData.message)
                  }
              },
              error: function(){}})
           
        }else if(stateNameCall == 'India_state' || PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY"){
            var link = "https://mycol.io:8080/stateWiseData";
            if(PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY"){
                link = "https://mycol.io:8080/qualityData";
            }else{
                link = "https://mycol.io:8080/stateWiseData";
            }
            
            $.ajax({
              type: 'POST',
              url: link,
              data: {var_data:JSON.stringify(apiVAR),ST_CD:(stateNameCall == 'India_state')?-1:StateCodeObject[stateNameCall]},
              withCredentials:true,
              dataType: "json",
              success: function(resultData) { 
                  
                  if(resultData.status == 'success'){
                      console.log(resultData)
                      
                      console.log("API Data downloaded")
                      stateAPIData = resultData.message;
                      callReady();
                  }else{
                     console.log(resultData.message)
                  }
              },
              error: function(){}})
            
        }else{
            
             $.ajax({
              type: 'POST',
              url: "https://mycol.io:8080/stateVaiablesData",
              data: {state_code:(stateNameCall == 'India'?'*':StateCodeObject[stateNameCall]),var_data:JSON.stringify(apiVAR)},
              withCredentials:true,
              dataType: "json",
              success: function(resultData) { 
                  
                  if(resultData.status == 'success'){
                      console.log(resultData)
                      
                      console.log("API Data downloaded")
                      stateAPIData = resultData.message;
                      callReady();
                  }else{
                     console.log(resultData.message)
                  }
              },
              error: function(){}})
        }
       
        
        
           
        function callReady(){
            
            if(stateAPIData!=null && STATEDistrictTopo!=null){
                if(PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY" || stateNameCall == 'India_state' || PlotCategory[categoryCall].plotType == "QUALITY_INDEX"){
                    if(canvas) canvas.remove();
                    qualityPlots(STATEDistrictTopo,stateAPIData);
                }else if(stateNameCall == 'India'){
                    if(canvas) canvas.remove();
                    PlotIndia(STATEDistrictTopo,stateAPIData);
                }else{
                    if(canvas) canvas.remove();
                    ready(STATEDistrictTopo,stateAPIData);
                }
            }
        }
        
           if(currentStatePlot == 'Andhra Pradesh'){
                var info = d3.select("#INFO-CAVEAT").text();
                d3.select("#INFO-CAVEAT").text(info +"   *The data shown is for Andhra Pradesh and Telangana combined");
            }else{
                d3.select("#INFO-CAVEAT").text("")
            }
           
           if(currentCategoryPlot == 'p_jsy_anc'){
                var info = d3.select("#INFO-CAVEAT").text();
                d3.select("#INFO-CAVEAT").text(info + " *JSY : Janani Suraksha Yojana");
            }else{
                d3.select("#INFO-CAVEAT").text("")
            }
        
		function ready(STATEDistrictTopo,stateAPIData){
            
           /*var TotalSC2011,TotalSC2016, DesiredSC, TotalPHC2011,TotalPHC2016=0, DesiredPHC=0, TotalCHC2011,TotalCHC2016, DesiredCHC;*/
           var TotalRuralPop = 0, TotalRuralTribalPop = 0,TotalUrbanPopulation = 0,Total = 0, Desired = 0,TotalInfoVillage = 0,TotalPopulation = 0;
           
           //Variables for data filling
           var STATEDistrict,dataValue;
            
           /*QuickFix : To adjust the margin between map and legends for StateWise and IndiaWise map*/
           d3.select("#leg_id").style('margin-top','0');
            
           //Consolidating the STATE data in one file
           STATEDistrictTopo.objects['2011_Dist'].geometries.forEach(function(d,i){
               
                var ST_NM = STATE;
                if(STATE.toUpperCase() == 'NCT OF DELHI'){
                   
                }if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                    STATE == 'ARUNACHAL PRADESH'
                }
                if(d.properties.ST_NM != ST_NM)
                {
                    delete STATEDistrictTopo.objects['2011_Dist'].geometries[i];
                }else{
                    STATEDistrict = d.properties.DISTRICT;
                    
                    if( d.properties.DISTRICT == 'Bangalore'){
                        d.properties.DISTRICT = 'Bengaluru';
                    }if( d.properties.DISTRICT == 'Bangalore Rural'){
                        d.properties.DISTRICT = 'Bengaluru Rural';
                    }if( d.properties.DISTRICT == 'Darjiling'){
                        d.properties.DISTRICT = 'Darjeeling';
                    }if(d.properties.DISTRICT == 'Y.S.R'){
                        d.properties.DISTRICT = "YSR Kadapa"
                    }if(d.properties.DISTRICT == 'Ganganagar'){
                        d.properties.DISTRICT = "Sri Ganganagar"
                    }if(d.properties.DISTRICT == 'Jhunjhunun'){
                        d.properties.DISTRICT = "Jhunjhunu";
                    }if(d.properties.DISTRICT == 'Dohad'){
                        d.properties.DISTRICT = "Dahod";
                    }
                    
                    stateAPIData.forEach(function(d2){
                        if(d2.DISTRICT == STATEDistrict)
                                {
                                    //Loading the variables specified in the plotVar category list
                                    apiVAR.forEach(function(pv){
                                        prop = pv.data_var;
                                        d.properties[prop] = d2[prop];
                                    })
                                    
                                    d.properties.n_total_pop = d2.n_rural_pop +d2.n_rural_tr_pop +d2.n_urban_pop;
                                
                                    if(categoryCall == "PHC_AVL"){
                                        Total += d2.desiredPHC - d2.shortagePHC;
                                        Desired += d2.desiredPHC;
                                    }else if(categoryCall == "SC_AVL"){
                                        Total += d2.desiredSC - d2.shortageSC;
                                        Desired += d2.desiredSC;
                                    }else if(categoryCall == "CHC_AVL"){
                                        Total += d2.desiredCHC - d2.shortageCHC;
                                        Desired += d2.desiredCHC;
                                    }else if(PlotCategory[categoryCall].plotType == "NON_COMP"){
                                        Total += d2[PlotCategory[categoryCall].reqVar[0].v];
                                    }
                                    
                                    if(categoryCall == "SC_ACCESSIBILITY" || categoryCall == "PHC_ACCESSIBILITY"){
                                        TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                                        
                                        TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v];
                                        
                                        TotalInfoVillage += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v] + d2[PlotCategory[categoryCall].reqVar[5].v];
                                    }else if(categoryCall == "CHC_ACCESSIBILITY"){
                                         TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                                        
                                        TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v];
                                        
                                        TotalInfoVillage += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v] + d2[PlotCategory[categoryCall].reqVar[5].v];
                                    }else{
                                        TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                                        TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v];
                                        TotalUrbanPopulation += d2.n_urban_pop;
                                        TotalPopulation += d.properties.n_total_pop;
                                    }
                                    
                                }
                        })
                }
            })
            
            $("#DENOMINATOR").text(PlotCategory[categoryCall].denom_head)
            $("#NUMERATOR").text(PlotCategory[categoryCall].num_head)
            
            console.log("This is the total data obtained",Total)
            
            console.log("State TopoJSON after loaded data : ",STATEDistrictTopo)
            console.log(TotalRuralTribalPop)
            
            projectionState = d3.geo.mercator()
                             .translate([-width*GEOM_WIDTH_R, height*GEOM_HEIGHT_R])
                             .scale([width*GEOM_SCALE_R]);
            pathState = d3.geo.path().projection(projectionState);
            
            d3.select(window).on('resize',function(){
                if(prevHeight < height){
                    
                     {fontSize = 10*(   height/prevHeight);}
                    
                 }else if(prevHeight > height){
                     
                      {fontSize = 10*(height/prevHeight);}
                 }else if(prevWidth < width){
                     
                     {fontSize = 10*(width/prevWidth);}
                 }else if(prevWidth > width){
                     
                      {fontSize = 10*(width/prevWidth);}
                 }
            width = parseInt(d3.select('#chart-area').style('width'))
            width = width - margin.left - margin.right;
            height = width*mapRatio;
                
            createState(currentStatePlot,currentCategoryPlot);
            
            })
            
        console.log("PLOT TYPE: ",PlotCategory[categoryCall].plotType)
        if(PlotCategory[categoryCall].plotType == "DIST"){
           dynamicPlot(); 
        }else if(PlotCategory[categoryCall].plotType == "NON_COMP"){
            dynamicPlotNonComp();   
        }else{
            dynamicPlotPercentage();
        }
        
    
            
        var infoDataMargin_left = 120;
        var infoDataMargin_top = 140;
        
            
        //Plotting the main data map
            
        function dynamicPlot()
            {
                var sht = apiVAR[0].data_var
                var dsr = apiVAR[3].data_var
                
                console.log("DYNAMIC_PLOT : ",sht + ": " + dsr)
                
                if(STATE.toUpperCase() == 'NCT OF DELHI'){
                   STATE == 'DELHI'
                }if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                    STATE == 'ARUNACHAL PRADESH'
                }
                
                
                $("#sub-info").addClass("col-border");
                $("#sub-info").show();
                $("#sub-info-q").hide();
                console.log(plotVarDef[plotVar.v].description.main_head + " : " + STATE )
                
                console.log("Myplot var : ",plotVar.v)
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
               
                legendsData.style('visibility','visible')
                
                canvas = d3.select('#chart-area').append('svg')
                    .attr('height',height)
                    .attr('width',width)
                    .style('background',"#fff")
                    .attr('width',width)
                
                d3.select("#CAVEAT").text("")
                $("#CAVEAT_ROW").hide();
                    if(STATE == "Andhra Pradesh"){
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                        // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        InfoStateName.text("Delhi".toUpperCase())
                    }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        InfoStateName.text(STATE.toUpperCase())
                    }
                
                InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                
                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation))
                InfoUrbanPopulationHead.text("Total Urban Population")
                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                InfoRequired.text(numberWithCommas(Desired))
                InfoExisting.text(numberWithCommas(Total))
                InfoRequiredLabel.text("Required")
                InfoExistingLabel.text("Existing")
                InfoRequired.style('background','#A5B3A4')
                InfoExisting.style('background','#BFDFF1')
                if(Desired - Total > 0){
                    ////console.log(Desired +" : " + Total)
                    InfoShortageLabel.text("Shortage (%)")
                    if(Desired == 0)
                    {
                        InfoShortage.text("");
                    }else if(Total == 0){
                        InfoShortage.text("Data not available");
                    }else{
                        //Changing the formula to {(Existing - Desired) / Desired}
                        InfoShortage.text(((Desired-Total)*100/Desired).toFixed(0)+"%")
                    }
                    
                    InfoExisting
                      .transition()
                      .duration(200)
                      .style('width',function(){
                        ////console.log(140*Total/Desired)
                        return (140*Total/Desired) + 'px';
                    })
                    InfoRequired
                      .transition()
                      .duration(200)
                      .style('width',function(){
                         return (140) + 'px';
                    })
                    InfoShortage.style('color','#D96331')
                }else{
                    InfoShortageLabel.text("Surplus (%)")
                    if(Desired == 0)
                    {
                        InfoShortage.text("");
                    }else if(isNaN((Total-Desired)/Desired))
                    {
                        InfoShortage.text("NA")

                    }else{
                        //Changing the formula to {(Existing - Desired) / Desired}
                        InfoShortage.text(((Total-Desired)*100/Desired).toFixed(0)+"%")
                    }
                    
                    InfoRequired
                      .transition()
                      .duration(200)
                      .style('width',function(){
                        ////console.log(140*Total/Desired)
                         return (140*Desired/Total) + 'px';
                    })
                    InfoExisting
                      .transition()
                      .duration(200)
                      .style('width',function(){
                        return (140) + 'px';
                    })
                    InfoShortage.style('color','#460')
                }
                
              var centered,zoomState=0;
              var g = canvas.append("g");
              
                outlineMap = g.append("g")
                        .selectAll("path")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                        .enter()
                        .append("path")
                        .attr("d", pathState)
                        .attr("class", "states")
                        .attr('stroke-width', 1)    
                        .attr('stroke', 'white')
                
                outlineMap.style('fill',function(d,i){
                    if(d == undefined || d.properties[sht] == undefined || d.properties[dsr]==undefined){
                        /*if(STATE == 'Andhra Pradesh' || STATE == 'Telangana'){
                            return "#FFF";
                        }*/
                        return color_PHC_shortage_STATE_2011[4];
                    }
                    else{ /*if(d.properties[sht]<=-30){
                        ////console.log(d.properties[sht])*/
                        if(d.properties[sht] > 0){
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(((d.properties[sht])*100/(d.properties[dsr])).toFixed(0) <= 25){
                                //console.log("Color limit ",((d.properties[sht])*100/(d.properties[dsr]-d.properties[sht])))
                                return plotVarDef[plotVar.v].limit.l4.c;
                            }else{
                                return plotVarDef[plotVar.v].limit.l3.c;
                            }
                        }
                        else if(d.properties[sht] <= 0){
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(((d.properties[sht]*-1)*100/(d.properties[dsr])).toFixed(0) <= 25){
                                return plotVarDef[plotVar.v].limit.l2.c;
                            }else{
                                return plotVarDef[plotVar.v].limit.l1.c;
                            } 
                        }
                    }
                 })
                .on('click',function(d){
                        
                  })
               .on('mouseover',function(d){
                
                d3.select(this).style('opacity',"0.6")
                    if(STATE == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                         MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        //InfoStateName.text("Delhi".toUpperCase())
                    }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + STATE)
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                    }
                    
                    if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                           InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoUrbanPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                        InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                        
                        InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        InfoRuralTribalPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[2].v]))
                        InfoUrbanPopulation.text(numberWithCommas(d.properties.n_urban_pop));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(d.properties[dsr]))
                        InfoExisting.text(numberWithCommas( d.properties[dsr] - d.properties[sht]))
                        if(d.properties[sht] > 0){
                            InfoShortageLabel.text("Shortage (%)")
                            if(d.properties[dsr] == 0)
                            {
                                InfoShortage.text("");
                            }else if(isNaN((d.properties[sht])*100/(d.properties[dsr])))
                            {
                                InfoShortage.text("NA")

                            }else{
                                //Changing the formula to {(Existing - Desired) / Desired}
                                InfoShortage.text(((d.properties[sht])*100/(d.properties[dsr])).toFixed(0)+"%")
                            }
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })

                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140*(d.properties[dsr] - d.properties[sht])/d.properties[dsr]) + 'px';
                            })

                            InfoShortage.style('color','#D96331')
                        }else{
                            
                            InfoShortageLabel.text("Surplus (%)")
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(d.properties[dsr] == 0)
                            {
                                InfoShortage.text("");
                            }else if(isNaN((d.properties[sht]*-1)*100/(d.properties[dsr])))
                            {
                                InfoShortage.text("NA")

                            }else{
                                
                                InfoShortage.text(((d.properties[sht]*-1)*100/(d.properties[dsr])).toFixed(0)+"%")
                            }
                             InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                //////console.log(140*TotalPHC2016/DesiredPHC)
                                 return (140*d.properties[dsr]/(d.properties[dsr] - d.properties[sht])) + 'px';
                            })

                            InfoShortage.style('color','#460')
                        }
                    }
                 }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select(this).style('opacity',"1")
                    
                        InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                    
                            if(STATE == "Andhra Pradesh"){
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                        // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        InfoStateName.text("Delhi".toUpperCase())
                    }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        InfoStateName.text(STATE.toUpperCase())
                    }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(Desired))
                        InfoExisting.text(numberWithCommas(Total))
                        if(Desired - Total > 0){
                            ////console.log(Desired +" : " + Total)
                            InfoShortageLabel.text("Shortage (%)")
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }else if(isNaN((Desired-Total)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Desired-Total)*100/Desired).toFixed(0)+"%")
                            }
                            
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                return (140*Total/Desired) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })
                            InfoShortage.style('color','#D96331')
                        }else{
                            InfoShortageLabel.text("Surplus (%)")
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }else if(isNaN((Total-Desired)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Total-Desired)*100/Desired).toFixed(0)+"%")
                            }
                            
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                 return (140*Desired/Total) + 'px';
                            })
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoShortage.style('color','#460')
                        }
                     })

                
                    //d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                    d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                    d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                    d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                    d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                    d3.select("#d1").text("> 25%");
                    d3.select("#d2").text("0 - 25%");
                    d3.select("#d3").text("0 - 25%");
                    d3.select("#d4").text("> 25%");
         }
      
        function dynamicPlotPercentage()
            {
                
                
                console.log(plotVarDef[plotVar.v].description.main_head)
                
                console.log("Myplot var : ",plotVar.v)
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                
                InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
           
                  {
                        canvas = d3.select('#chart-area').append('svg')
                        .attr('height',height)
                        .attr('width',width)
                        .style('background',"#fff")
                        .attr('width',width)
                   }
                
                $("#sub-info").addClass("col-border");
                $("#sub-info").show();
                $("#sub-info-q").hide();
                
                d3.select("#CAVEAT").text("")
                $("#CAVEAT_ROW").hide()  
                if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                    if(STATE == "Andhra Pradesh"){
                         //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                         //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        InfoStateName.text("Delhi".toUpperCase())
                    }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + STATE)
                        InfoStateName.text(STATE.toUpperCase())
                    }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text("");
                        InfoUrbanPopulationHead.text("")
                        InfoHealthCategoryName.text("")                        
                        InfoExisting.text("")
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }else{
                            if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                 //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                        InfoUrbanPopulationHead.text("Total Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                        })
                       
                        InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("Percent")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }
                       
                  var g = canvas.append("g");
                  var centered,zoomState=0;
                   outlineMap = g.append("g")
                        .selectAll("path")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                        .enter()
                        .append("path")
                        .attr("d", pathState)
                        .attr("class", "states")
                        .attr('stroke-width', 1)
                        .attr('stroke', 'white')
                  
             
                
              outlineMap.attr('stroke-width', 1)
                  .attr('stroke', 'white')
                  .style('fill',function(d,i){
                        
                   if(d == undefined || d.properties[plotVar.v]== undefined){
                        return '#445'//colorAccessSubCenter_STATE_gt_5km[4];
                    }
                    else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l4.l && d.properties[plotVar.v].toFixed(0)<plotVarDef[plotVar.v].limit.l4.r){
                        return plotVarDef[plotVar.v].limit.l4.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l3.l && d.properties[plotVar.v].toFixed(0) <=plotVarDef[plotVar.v].limit.l3.r){
                        return plotVarDef[plotVar.v].limit.l3.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l2.l && d.properties[plotVar.v].toFixed(0)<=plotVarDef[plotVar.v].limit.l2.r){
                        return plotVarDef[plotVar.v].limit.l2.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >plotVarDef[plotVar.v].limit.l1.l ){
                        return plotVarDef[plotVar.v].limit.l1.c;
                    }else{
                        return '#000'
                    }
                 })
               .on('mouseover',function(d){
                        if(d.properties.ST_NM == "Andhra Pradesh"){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                            //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                        }else if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                             MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                            //InfoStateName.text("Delhi".toUpperCase())
                        }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                            //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                        }else{
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                            //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                        }
                  
                    
                    d3.select(this).style('opacity',"0.6")
                      if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                            if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                            }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                                InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                            }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                                InfoStateName.text("District : " + "Jhunjhunu");
                            }else{
                                InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                            }
                            if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC' || plotVar.v == 'p_within10_CHC'){  
                                InfoUrbanPopulation.text("")
                            }else{
                                InfoUrbanPopulation.text("NA")
                            }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")
                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                       
                          
                        if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                          
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC'){  
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])))
                            
                        InfoExistingLabel.text("Percent*");
                         $("#CAVEAT_ROW").show()   
                         d3.select("#CAVEAT").text("*Based on Census 2011 sample size of "+((parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[5].v]))/parseFloat(d.properties[PlotCategory[categoryCall].reqVar[1].v])*100).toFixed(0)+"% villages");
                            
                        }else if(plotVar.v == 'p_within10_CHC'){
                            
                        InfoExistingLabel.text("Percent*")
                         $("#CAVEAT_ROW").show();     
                         d3.select("#CAVEAT").text("*Based on Census 2011 sample size of "+((parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[5].v]))/parseFloat(d.properties[PlotCategory[categoryCall].reqVar[1].v])*100).toFixed(0)+"% villages");
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])))
                            
                        }else{
                            
                        InfoExistingLabel.text("Percent")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                        }
                          
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                             InfoUrbanPopulation.text("");
                             InfoUrbanPopulationHead.text("")
                        }else{
                             InfoUrbanPopulation.text(numberWithCommas(d.properties.n_total_pop));
                             InfoUrbanPopulationHead.text("Total Population")
                        }
                            
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]).toFixed(0)+"%")
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        
                        //console.log("Total v : " +d.properties[PlotCategory[categoryCall].reqVar[0].v] + " :: Total data : " + (parseFloat(d.properties[PlotCategory[categoryCall].reqVar[1].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])) )  
                    
                       
                      }
                }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select("#CAVEAT").text("")
                    $("#CAVEAT_ROW").hide();
                    d3.select(this).style('opacity',"1")
                       if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                 //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoUrbanPopulation.text("");
                                InfoUrbanPopulationHead.text("")
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                  if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                 //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                                InfoExisting
                                      .transition()
                                      .duration(200)
                                      .style('width',function(){
                                        return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                                })

                                InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")

                                InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                                InfoUrbanPopulationHead.text("Total Population")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#BFDFF1')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("Percent")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                })

                d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                if(plotVarDef[plotVar.v].limit.l1.r == 100){
                    d3.select("#d4").text("< "+plotVarDef[plotVar.v].limit.l4.r+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("> " + plotVarDef[plotVar.v].limit.l1.l+"%");
                }else{
                    d3.select("#d4").text("> "+ plotVarDef[plotVar.v].limit.l4.l+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("< "+ plotVarDef[plotVar.v].limit.l1.r+"%");
                }
        }
            
       function dynamicPlotNonComp()
        {
            
                InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
             
            
                console.log(plotVarDef[plotVar.v].description.main_head)
                
                console.log("Myplot var : ",plotVar.v)
                $("#legends").hide()
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
           
                  {
                        canvas = d3.select('#chart-area').append('svg')
                        .attr('height',height)
                        .attr('width',width)
                        .style('background',"#fff")
                        .attr('width',width)
                   }
            
                $("#sub-info").show();
                $("#sub-info").addClass("col-border");
                $("#sub-info-q").hide();
            
                d3.select("#CAVEAT").text("")
                $("#CAVEAT_ROW").hide()  
                if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                            if(STATE.toUpperCase() == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text("");
                        InfoUrbanPopulationHead.text("")
                        InfoHealthCategoryName.text("")                        
                        InfoExisting.text("")
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }else{
                            if(STATE.toUpperCase() == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                    
                        InfoExistingLabel.style("font-size","20px")
                        InfoExisting.style("font-size","30px")
                       
                        InfoExisting.text(Total)
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("No. of Hospitals")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }
                       
                  var g = canvas.append("g");
                  var centered,zoomState=0;
                   outlineMap = g.append("g")
                        .selectAll("path")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                        .enter()
                        .append("path")
                        .attr("d", pathState)
                        .attr("class", "states")
                        .attr('stroke-width', 1)
                        .attr('stroke', 'white')
                        .style('fill',function(d){
                            if(d==undefined){
                                return "#000";
                            }else{
                                return "#74A9CF"
                            }
                        })
                  
             
                
              outlineMap/*.attr('stroke-width', 1)
                  .attr('stroke', 'white')
                  .style('fill',function(d,i){
                        
                   if(d == undefined || d.properties[plotVar.v]== undefined){
                        return '#445'//colorAccessSubCenter_STATE_gt_5km[4];
                    }
                    else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l4.l && d.properties[plotVar.v].toFixed(0)<plotVarDef[plotVar.v].limit.l4.r){
                        return plotVarDef[plotVar.v].limit.l4.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l3.l && d.properties[plotVar.v].toFixed(0) <=plotVarDef[plotVar.v].limit.l3.r){
                        return plotVarDef[plotVar.v].limit.l3.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l2.l && d.properties[plotVar.v].toFixed(0)<=plotVarDef[plotVar.v].limit.l2.r){
                        return plotVarDef[plotVar.v].limit.l2.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >plotVarDef[plotVar.v].limit.l1.l ){
                        return plotVarDef[plotVar.v].limit.l1.c;
                    }else{
                        return '#000'
                    }
                 })*/
               .on('mouseover',function(d){
                    if(d.properties.ST_NM == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                         MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        //InfoStateName.text("Delhi".toUpperCase())
                    }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                    }
                  
                    if(plotVar.v != 'p_within5_SC' || plotVar.v != 'p_within10_CHC' || plotVar.v != 'p_within5_PHC'){
                        InfoUrbanPopulation.text(numberWithCommas(d.properties.n_urban_pop));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                     }
                  
                    d3.select(this).style('opacity',"0.6")
                       if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[1].v]==undefined){
                        
                             if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoUrbanPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                        if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                          
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                       
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                        InfoExistingLabel.text("No. of Hospitals")
                          
                          
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]))
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        
                       
                      }
                }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select("#CAVEAT").text("")
                    $("#CAVEAT_ROW").hide()  
                    d3.select(this).style('opacity',"1")
                       if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                             if(STATE.toUpperCase() == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                            
                                InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                                InfoUrbanPopulationHead.text("Total Urban Population")
                            
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                               
                                InfoExisting.text(Total)

                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("No. of Hospitals")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                })

                d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                if(plotVarDef[plotVar.v].limit.l1.r == 100){
                    d3.select("#d4").text("< "+plotVarDef[plotVar.v].limit.l4.r+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("> " + plotVarDef[plotVar.v].limit.l1.l+"%");
                }else{
                    d3.select("#d4").text("> "+ plotVarDef[plotVar.v].limit.l4.l+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("< "+ plotVarDef[plotVar.v].limit.l1.r+"%");
                }
        }
            
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }  
    }
           
    function PlotIndia(STATEDistrictTopo,stateAPIData){
            
           /*QuickFix : To adjust the margin between map and legends for StateWise and IndiaWise map*/
           d3.select("#leg_id").style('margin-top','0');
        
           var TotalRuralPop = 0, TotalRuralTribalPop = 0,TotalUrbanPopulation = 0,Total = 0, Desired = 0,TotalInfoVillage = 0,TotalPopulation = 0;
           
           //Variables for data filling
           var STATEDistrict,dataValue;
            
           MainHeading.text("Generating India Map ... ")
           //Consolidating the STATE data in one file
           STATEDistrictTopo.objects['2011_Dist'].geometries.forEach(function(d,i){
               
               
                    STATEDistrict = d.properties.DISTRICT;
                    
                    stateAPIData.forEach(function(d2){
                        if(d2.DISTRICT == STATEDistrict)
                                {
                                    
                                     if( d.properties.DISTRICT == 'Bangalore'){
                                        d.properties.DISTRICT = 'Bengaluru';
                                    }if( d.properties.DISTRICT == 'Bangalore Rural'){
                                        d.properties.DISTRICT = 'Bengaluru Rural';
                                    }if( d.properties.DISTRICT == 'Darjiling'){
                                        d.properties.DISTRICT = 'Darjeeling';
                                    }if(d.properties.DISTRICT == 'Y.S.R'){
                                        d.properties.DISTRICT = "YSR Kadapa"
                                    }if(d.properties.DISTRICT == 'Ganganagar'){
                                        d.properties.DISTRICT = "Sri Ganganagar"
                                    }if(d.properties.DISTRICT == 'Jhunjhunun'){
                                        d.properties.DISTRICT = "Jhunjhunu";
                                    }if(d.properties.DISTRICT == 'Dohad'){
                                        d.properties.DISTRICT = "Dahod";
                                    }

                                    //Loading the variables specified in the plotVar category list
                                    apiVAR.forEach(function(pv){
                                        prop = pv.data_var;
                                        d.properties[prop] = d2[prop];
                                    })
                                 
                                    if(categoryCall == "PHC_AVL"){
                                        Total += d2.desiredPHC - d2.shortagePHC;
                                        Desired += d2.desiredPHC;
                                    }else if(categoryCall == "SC_AVL"){
                                        Total += d2.desiredSC - d2.shortageSC;
                                        Desired += d2.desiredSC;
                                    }else if(categoryCall == "CHC_AVL"){
                                        Total += d2.desiredCHC - d2.shortageCHC;
                                        Desired += d2.desiredCHC;
                                    }
                                    
                                    d.properties.n_urban_pop = d2.n_urban_pop
                                    d.properties.n_total_pop = d2.n_urban_pop + d2.n_rural_pop + d2.n_rural_tr_pop;
                                    
                                    
                                    if(categoryCall == "SC_ACCESSIBILITY" || categoryCall == "PHC_ACCESSIBILITY"){
                                        TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                                        
                                        TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v];
                                        
                                        TotalInfoVillage += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v] + d2[PlotCategory[categoryCall].reqVar[5].v];
                                        
                                        
                                        
                                    }else if(categoryCall == "CHC_ACCESSIBILITY"){
                                         TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                                        
                                        TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v];
                                        
                                        TotalInfoVillage += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v] + d2[PlotCategory[categoryCall].reqVar[5].v];
                                        
                                        
                                        
                                    }else{
                                        TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                                        TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v];
                                        
                                    }
                                    
                                    TotalUrbanPopulation += d2.n_urban_pop;
                                    TotalPopulation += d.properties.n_total_pop;
                                }
                        })
                
            })
         
            console.log("Urban populaion ",TotalUrbanPopulation)
            
            $("#DENOMINATOR").text(PlotCategory[categoryCall].denom_head)
            $("#NUMERATOR").text(PlotCategory[categoryCall].num_head)
            
            console.log("State TopoJSON after loaded data : ",STATEDistrictTopo)
            console.log(TotalRuralTribalPop)
        
           d3.select(window).on('resize',function(){
                if(prevHeight < height){
                    
                     {fontSize = 10*(   height/prevHeight);}
                    
                 }else if(prevHeight > height){
                     
                      {fontSize = 10*(height/prevHeight);}
                 }else if(prevWidth < width){
                     
                     {fontSize = 10*(width/prevWidth);}
                 }else if(prevWidth > width){
                     
                      {fontSize = 10*(width/prevWidth);}
                 }
            width = parseInt(d3.select('#chart-area').style('width'))
            width = width - margin.left - margin.right;
            height = width*mapRatio;
                
            createState(currentStatePlot,currentCategoryPlot);
            
            })
        
        
        console.log("PLOT TYPE: ",PlotCategory[categoryCall].plotType)
        if(PlotCategory[categoryCall].plotType == "DIST"){
           dynamicPlot(); 
        }else{
            dynamicPlotPercentage();
        }
        
        function dynamicPlot()
            {
                var sht = apiVAR[0].data_var
                var dsr = apiVAR[3].data_var
                
                InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
               
                $("#HR").hide()
                $("#INFRA").hide()
                $("#SUPPLY").hide()
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
               
                legendsData.style('visibility','visible')
                
                canvas = d3.select('#chart-area').append('svg')
                    //.attr('height',height)
                    .attr('width',width)
                    .style('background',"#fff")
                    .attr('height',width*.65)
                
                var projectionState = d3.geo.mercator()
                             .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                var pathState = d3.geo.path().projection(projectionState);
                d3.select("#CAVEAT").text("")
                $("#CAVEAT_ROW").hide()  
                InfoStateName.text("INDIA".toUpperCase())
                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                InfoUrbanPopulationHead.text("Total Urban Population")
                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                InfoRequired.text(numberWithCommas(Desired))
                InfoExisting.text(numberWithCommas(Total))
                InfoRequiredLabel.text("Required")
                InfoExistingLabel.text("Existing")
                InfoRequired.style('background','#A5B3A4')
                InfoExisting.style('background','#BFDFF1')
                if(Desired - Total > 0){
                    //Changing the formula to {(Existing - Desired) / Desired}
                    InfoShortageLabel.text("Shortage (%)")
                    if(Desired == 0)
                    {
                        InfoShortage.text("");
                    }
                    else if(isNaN((Desired-Total)*100/Desired))
                    {
                        InfoShortage.text("NA")

                    }else{
                        InfoShortage.text(((Desired-Total)*100/Desired).toFixed(0)+"%")
                    }
                    
                    InfoExisting
                      .transition()
                      .duration(200)
                      .style('width',function(){
                        ////console.log(140*Total/Desired)
                        return (140*Total/Desired) + 'px';
                    })
                    InfoRequired
                      .transition()
                      .duration(200)
                      .style('width',function(){
                         return (140) + 'px';
                    })
                    InfoShortage.style('color','#D96331')
                }else{
                    InfoShortageLabel.text("Surplus (%)")
                    //Changing the formula to {(Existing - Desired) / Desired}
                    if(Desired == 0)
                    {
                        InfoShortage.text("");
                    }
                    else if(isNaN((Total-Desired)*100/Desired))
                    {
                        InfoShortage.text("NA")

                    }else{
                        InfoShortage.text(((Total-Desired)*100/Desired).toFixed(0)+"%")
                    }
                    
                    
                    InfoRequired
                      .transition()
                      .duration(200)
                      .style('width',function(){
                        ////console.log(140*Total/Desired)
                         return (140*Desired/Total) + 'px';
                    })
                    InfoExisting
                      .transition()
                      .duration(200)
                      .style('width',function(){
                        return (140) + 'px';
                    })
                    InfoShortage.style('color','#460')
                }
                
              var centered,zoomState=0;
              var g = canvas.append("g");
              
                
                
                
                
                outlineMap = g.append("g")
                        .selectAll("path")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                        .enter()
                        .append("path")
                        .attr("d", pathState)
                        .attr("class", "states")
                        .attr('stroke-width', 0.2)
                        .attr('stroke', 'white')
                
                
                
               
                
                outlineMap.style('fill',function(d,i){
                    if(d == undefined || d.properties[plotVar.v]== undefined){
                        return color_PHC_shortage_STATE_2011[4];
                    }
                    else{ 
                        //Changing the formula to {(Existing - Desired) / Desired}
                        if(d.properties[sht] > 0){
                            if(((d.properties[sht])*100/(d.properties[dsr])).toFixed(0) <= 25){
                                return plotVarDef[plotVar.v].limit.l4.c;
                            }else{
                                return plotVarDef[plotVar.v].limit.l3.c;
                            }
                        }
                        else if(d.properties[sht] <= 0){
                            if(((d.properties[sht]*-1)*100/(d.properties[dsr])).toFixed(0) <= 25){
                                return plotVarDef[plotVar.v].limit.l2.c;
                            }else{
                                return plotVarDef[plotVar.v].limit.l1.c;
                            } 
                        }
                    }
                 })
                .on('click',function(d){
                        
                  })
               .on('mouseover',function(d){
                
                d3.select(this).style('opacity',"0.6")
                
                    if(d.properties.ST_NM == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else 
                    if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                         MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        //InfoStateName.text("Delhi".toUpperCase())
                    }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                    }
                    
                     if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                            if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                         
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                           InfoUrbanPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined){
                          
                        InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                    
                        if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        InfoRuralTribalPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[2].v]))
                        InfoUrbanPopulation.text(numberWithCommas(d.properties.n_urban_pop));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(d.properties[dsr]))
                        InfoExisting.text(numberWithCommas( d.properties[dsr] - d.properties[sht]))
                        if(d.properties[sht] > 0){
                            InfoShortageLabel.text("Shortage (%)")
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(d.properties[dsr] == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((d.properties[sht])*100/(d.properties[dsr])))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((d.properties[sht])*100/(d.properties[dsr])).toFixed(0)+"%")
                            }
                            
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })

                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                //////console.log(140*(d.properties[dsr] - d.properties[sht])/d.properties[dsr])
                                return (140*(d.properties[dsr] - d.properties[sht])/d.properties[dsr]) + 'px';
                            })

                            InfoShortage.style('color','#D96331')
                        }else{
                            
                            InfoShortageLabel.text("Surplus %")
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(d.properties[dsr] == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((d.properties[sht]*-1)*100/(d.properties[dsr])))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((d.properties[sht]*-1)*100/(d.properties[dsr])).toFixed(0)+"%")
                            }
                            
                            
                             InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                //////console.log(140*TotalPHC2016/DesiredPHC)
                                 return (140*d.properties[dsr]/(d.properties[dsr] - d.properties[sht])) + 'px';
                            })

                            InfoShortage.style('color','#460')
                        }
                    }
                 }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select(this).style('opacity',"1")
                    
                        InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                    
                        InfoStateName.text("INDIA")
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(Desired))
                        InfoExisting.text(numberWithCommas(Total))
                        if(Desired - Total > 0){
                            ////console.log(Desired +" : " + Total)
                            InfoShortageLabel.text("Shortage (%)")
                            //Changing the formula to {(Existing - Desired) / Desired}
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((Desired-Total)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Desired-Total)*100/Desired).toFixed(0)+"%")
                            }
                            
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                return (140*Total/Desired) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })
                            InfoShortage.style('color','#D96331')
                        }else{
                            //Changing the formula to {(Existing - Desired) / Desired}
                            InfoShortageLabel.text("Surplus (%)")
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((Total-Desired)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Total-Desired)*100/Desired).toFixed(0)+"%")
                            }
                            
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                 return (140*Desired/Total) + 'px';
                            })
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoShortage.style('color','#460')
                        }
                     })

                    //d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                    d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                    d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                    d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                    d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                    d3.select("#d1").text("> 25%");
                    d3.select("#d2").text("0 - 25%");
                    d3.select("#d3").text("0 - 25%");
                    d3.select("#d4").text("> 25%");
         }
        

 
        
         function dynamicPlotPercentage()
            {
                
                
                console.log("India Map : Step 1")
                
                InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head +" : INDIA")
                
                $("#HR").hide()
                $("#INFRA").hide()
                $("#SUPPLY").hide()
               
                legendsData.style('visibility','visible')
                
                canvas = d3.select('#chart-area').append('svg')
                   .attr('width',width)
                    .style('background',"#fff")
                    .attr('height',width*.65)
                
                var projectionState = d3.geo.mercator()
                               .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                var pathState = d3.geo.path().projection(projectionState);
                
                 d3.select("#CAVEAT").text("")
                $("#CAVEAT_ROW").hide()  
                if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                        InfoStateName.text("INDIA".toUpperCase())
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text("");
                        InfoUrbanPopulationHead.text("")
                        InfoHealthCategoryName.text("")                        
                        InfoExisting.text("")
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }else{
                        InfoStateName.text("INDIA".toUpperCase())
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                        InfoUrbanPopulationHead.text("Total Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                        })
                       
                        InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("Percent")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        $(".SUB_CATEGORY_DROPDOWN_SELECT").hide();  
                }
                
                
              var centered,zoomState=0;
              var g = canvas.append("g");
              
                outlineMap = g.append("g")
                        .selectAll("path")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                        .enter()
                        .append("path")
                        .attr("d", pathState)
                        .attr("class", "states")
                        .attr('stroke-width', 0.2)
                        .attr('stroke', 'white')
                if(currentCategoryPlot == 'SDH_AVL' || currentCategoryPlot == 'DH_AVL'){
                      outlineMap
                          .attr('stroke', 'white')
                          .style('fill',"BFDFF1")
                }else{
                     outlineMap
                          .attr('stroke', 'white')
                          .style('fill',function(d,i){

                           if(d == undefined || d.properties[plotVar.v] == undefined){
                                return '#445'//colorAccessSubCenter_STATE_gt_5km[4];
                            }
                            else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l4.l && d.properties[plotVar.v].toFixed(0)<plotVarDef[plotVar.v].limit.l4.r){
                                return plotVarDef[plotVar.v].limit.l4.c;
                            }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l3.l && d.properties[plotVar.v].toFixed(0) <=plotVarDef[plotVar.v].limit.l3.r){
                                return plotVarDef[plotVar.v].limit.l3.c;
                            }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l2.l && d.properties[plotVar.v].toFixed(0)<=plotVarDef[plotVar.v].limit.l2.r){
                                return plotVarDef[plotVar.v].limit.l2.c;
                            }else if(d.properties[plotVar.v].toFixed(0) >plotVarDef[plotVar.v].limit.l1.l ){
                                return plotVarDef[plotVar.v].limit.l1.c;
                            }else{
                                return '#000'
                            }
                         })
                }
                 
                outlineMap.on('click',function(d){
                        
                  })
               .on('mouseover',function(d){
                    if(d.properties.ST_NM == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else 
                    if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                         MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        //InfoStateName.text("Delhi".toUpperCase())
                    }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                    }
                    d3.select(this).style('opacity',"0.6")
                     
                   
                       
                     
                     if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                            if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                         
                           if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC' || plotVar.v == 'p_within10_CHC'){  
                                InfoUrbanPopulation.text("")
                            }else{
                                InfoUrbanPopulation.text("NA")
                            }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            
                            InfoUrbanPopulationHead.text("")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                        if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC'){  
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])))
                            
                        InfoExistingLabel.text("Percent*");
                            
                        }else if(plotVar.v == 'p_within10_CHC'){
                            
                        InfoExistingLabel.text("Percent*")
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])))
                            
                        }else{
                            
                        InfoExistingLabel.text("Percent")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                        }
                          
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]).toFixed(0)+"%")
                          
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                            InfoUrbanPopulation.text("");
                            InfoUrbanPopulationHead.text("")
                        }else{
                            InfoUrbanPopulation.text(numberWithCommas(d.properties.n_total_pop));
                            InfoUrbanPopulationHead.text("Total Population")
                        }
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                          
                        /* Caveats discription here !!! */
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC'){  
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])))
                            
                        InfoExistingLabel.text("Percent*");
                         $("#CAVEAT_ROW").show()   
                         d3.select("#CAVEAT").text("*Based on Census 2011 sample size of "+((parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[5].v]))/parseFloat(d.properties[PlotCategory[categoryCall].reqVar[1].v])*100).toFixed(0)+"% villages");
                            
                        }else if(plotVar.v == 'p_within10_CHC'){
                            
                        InfoExistingLabel.text("Percent*")
                         $("#CAVEAT_ROW").show();     
                         d3.select("#CAVEAT").text("*Based on Census 2011 sample size of "+((parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[5].v]))/parseFloat(d.properties[PlotCategory[categoryCall].reqVar[1].v])*100).toFixed(0)+"% villages");
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])))
                            
                        }else{
                            
                         InfoExistingLabel.text("Percent")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                        }  
                          
                        $("#CAVEAT_ROW").show()  
                        if(currentCategoryPlot == "SDH_AVL" || currentCategoryPlot == "DH_AVL"){
                            $("#legends").hide()
                        }
                        
                      }
                }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select(this).style('opacity',"1")
                     
                         d3.select("#CAVEAT").text("")
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                                InfoStateName.text("INDIA".toUpperCase())
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoUrbanPopulation.text("");
                                InfoUrbanPopulationHead.text("")
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                InfoStateName.text("INDIA".toUpperCase())
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                                InfoUrbanPopulationHead.text("Total Population")
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                                InfoExisting
                                      .transition()
                                      .duration(200)
                                      .style('width',function(){
                                        return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                                })

                                InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")

                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#BFDFF1')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("Percent")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                })
                
                if(currentCategoryPlot == "SDH_AVL" || currentCategoryPlot == "DH_AVL"){
                    $("#legends").hide()
                }else{
                }
                
                    d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                    d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                    d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                    d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                    d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                if(plotVarDef[plotVar.v].limit.l1.r == 100){
                    d3.select("#d4").text("< "+plotVarDef[plotVar.v].limit.l4.r+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("> " + plotVarDef[plotVar.v].limit.l1.l+"%");
                }else{
                    d3.select("#d4").text("> "+ plotVarDef[plotVar.v].limit.l4.l+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("< "+ plotVarDef[plotVar.v].limit.l1.r+"%");
                }
         }
        
        function dynamicPlotNonComp()
           {
                console.log(plotVarDef[plotVar.v].description.main_head)
                
               
                InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
                InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
               
                console.log("Myplot var : ",plotVar.v)
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
               
             
           
                  {
                        canvas = d3.select('#chart-area').append('svg')
                        .attr('height',height)
                        .attr('width',width)
                        .style('background',"#fff")
                        .attr('width',width)
                   }
                $("#CAVEAT_ROW").hide()
                d3.select("#CAVEAT").text("")
                if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                         if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text("");
                        InfoUrbanPopulationHead.text("")
                        InfoHealthCategoryName.text("")                        
                        InfoExisting.text("")
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }else{
                         if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                       
                        InfoExistingLabel.style("font-size","20px")
                        InfoExisting.style("font-size","30px")
                    
                        InfoExisting.text(Total)
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("No. of Hospitals")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }
                 
                var projectionState = d3.geo.mercator()
                               .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                var pathState = d3.geo.path().projection(projectionState);
            
                  var g = canvas.append("g");
                  var centered,zoomState=0;
                   outlineMap = g.append("g")
                        .selectAll("path")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                        .enter()
                        .append("path")
                        .attr("d", pathState)
                        .attr("class", "states")
                        .attr('stroke-width', 1)
                        .attr('stroke', 'white')
                        .style('fill','#74A9CF')
                  
             
                
              outlineMap/*.attr('stroke-width', 1)
                  .attr('stroke', 'white')
                  .style('fill',function(d,i){
                        
                   if(d == undefined || d.properties[plotVar.v]== undefined){
                        return '#445'//colorAccessSubCenter_STATE_gt_5km[4];
                    }
                    else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l4.l && d.properties[plotVar.v].toFixed(0)<plotVarDef[plotVar.v].limit.l4.r){
                        return plotVarDef[plotVar.v].limit.l4.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l3.l && d.properties[plotVar.v].toFixed(0) <=plotVarDef[plotVar.v].limit.l3.r){
                        return plotVarDef[plotVar.v].limit.l3.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l2.l && d.properties[plotVar.v].toFixed(0)<=plotVarDef[plotVar.v].limit.l2.r){
                        return plotVarDef[plotVar.v].limit.l2.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >plotVarDef[plotVar.v].limit.l1.l ){
                        return plotVarDef[plotVar.v].limit.l1.c;
                    }else{
                        return '#000'
                    }
                 })*/
               .on('mouseover',function(d){
                   if(d.properties.ST_NM == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else
                    if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                         MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        //InfoStateName.text("Delhi".toUpperCase())
                    }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                    }
                  
                    
                    d3.select(this).style('opacity',"0.6")
                       if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                            if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoUrbanPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                        if(plotVar.v != 'p_within5_SC' || plotVar.v != 'p_within10_CHC' || plotVar.v != 'p_within5_PHC'){
                            InfoUrbanPopulation.text(d.properties.n_urban_pop);
                            InfoUrbanPopulationHead.text("Total Urban Population")
                        }
                          
                        if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                          
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                       
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                        InfoExistingLabel.text("No. of Hospitals")
                          
                          
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]))
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        
                       
                      }
                }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select("#CAVEAT").text("")
                    $("#CAVEAT_ROW").hide()
                    d3.select(this).style('opacity',"1")
                       if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                                InfoUrbanPopulationHead.text("Total Urban Population")
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                               
                                InfoExisting.text(Total)

                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("No. of Hospitals")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                })

                d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                if(plotVarDef[plotVar.v].limit.l1.r == 100){
                    d3.select("#d4").text("< "+plotVarDef[plotVar.v].limit.l4.r+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("> " + plotVarDef[plotVar.v].limit.l1.l+"%");
                }else{
                    d3.select("#d4").text("> "+ plotVarDef[plotVar.v].limit.l4.l+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("< "+ plotVarDef[plotVar.v].limit.l1.r+"%");
                }
        }
        
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }  
    }   
           
   function qualityPlots(STATEDistrictTopo,stateAPIData){
       
           /*var TotalSC2011,TotalSC2016, DesiredSC, TotalPHC2011,TotalPHC2016=0, DesiredPHC=0, TotalCHC2011,TotalCHC2016, DesiredCHC;*/
           var TotalRuralPop = 0, TotalRuralTribalPop = 0,TotalUrbanPopulation = 0,Total = 0, Desired = 0,TotalInfoVillage = 0,TotalPopulation = 0;
           
           var myQObj = null;
           //Variables for data filling
           var STATEDistrict,dataValue;
       
           /*QuickFix : To adjust the margin between map and legends for StateWise and IndiaWise map*/
           d3.select("#leg_id").style('margin-top','1.5%');

           if(PlotCategory[categoryCall].plotType == "QUALITY_INDEX"){

               console.log("Quality Plots indetified!!")

               STATEDistrictTopo.objects.Admin2.geometries.forEach(function(d,i){



                         stateAPIData.forEach(function(d2,i)
                          {
                             if(StateCodeObject[d.properties.ST_NM] == d2.ST_CD){
                             d.properties.TYPE = d2.TYPE;
                             d.properties.ST_CD = d2.ST_CD;
                             d.properties.RANKING = d2.RANKING;
                             d.properties.HQNI = d2.HQNI;
                             d.properties.HQLI = d2.HQLI;
                             d.properties.HII = d2.HII;}

                          })

               })


           }else if(PlotCategory[categoryCall].plotType == "NON_COMP" && stateNameCall == 'India_state'){
               
               STATEDistrictTopo.objects.Admin2.geometries.forEach(function(d,i){
                  
                   
                       
                         stateAPIData.forEach(function(d2,i)
                          {
                             if(d.properties.ST_NM == d2.ST_NM){
                                 
                                    apiVAR.forEach(function(pv){
                                        prop = pv.data_var;
                                        d.properties[prop] = d2[prop];
                                    })
                                 TotalUrbanPopulation += d2.n_urban_pop;
                                 TotalRuralPop += d2.n_rural_pop;
                                 TotalRuralTribalPop += d2.n_rural_tr_pop;
                                 Total += parseInt(d2[PlotCategory[categoryCall].reqVar[0].v]);
                             }
                             
                             
                            //Loading the variables specified in the plotVar category list
                          })
                   
               })
               
               
           }else if(stateNameCall == 'India'){
               
           }else if(PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY" && stateNameCall != 'India_state'){
               
               STATEDistrictTopo.objects.Admin2.geometries.forEach(function(d,i){
                   
                   if(STATE == 'Andhra Pradesh'){
                       
                       if(d.properties.ST_NM == 'Andhra Pradesh' || d.properties.ST_NM == 'Telangana'){
                       
                         stateAPIData.forEach(function(d2,i)
                          {
                            //Loading the variables specified in the plotVar category list
                            apiVAR.forEach(function(pv){
                                prop = pv.data_var;
                                d.properties[prop] = d2[prop];
                            })
                          })
                        
                       }else{

                           delete STATEDistrictTopo.objects.Admin2.geometries[i];
                       }
                       
                   }else{
                       
                       if(d.properties.ST_NM == STATE ){
                       
                         stateAPIData.forEach(function(d2,i)
                          {
                            //Loading the variables specified in the plotVar category list
                            apiVAR.forEach(function(pv){
                                prop = pv.data_var;
                                d.properties[prop] = d2[prop];
                            })
                          })
                        
                       }else{

                           delete STATEDistrictTopo.objects.Admin2.geometries[i];
                       }
                       
                   }
               })
               
           }else if(PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY" && stateNameCall == 'India_state'){
               
               STATEDistrictTopo.objects.Admin2.geometries.forEach(function(d,i){
                  
                   //if(d.properties.ST_NM == STATE || (d.properties.ST_NM == "Andhra Pradesh" || d.properties.ST_NM == "Telangana")){
                        
                         stateAPIData.forEach(function(d2,i)
                          {  if(d2.ST_NM == 'All India'){
                                myQObj = d2;
                             }
                             if(d.properties.ST_NM == d2.ST_NM){
                                 
                                   //Loading the variables specified in the plotVar category list
                                    apiVAR.forEach(function(pv){
                                        prop = pv.data_var;
                                        d.properties[prop] = d2[prop];
                                    })
                             }
                             
                    })
               })
               
           }else if(stateNameCall == 'India_state'){
               
               STATEDistrictTopo.objects.Admin2.geometries.forEach(function(d,i){
                   var StateName = d.properties.ST_NM;
                   stateAPIData.forEach(function(d2,i)
                   {
                       if(d2.ST_NM == StateName){
                        //Loading the variables specified in the plotVar category list
                        apiVAR.forEach(function(pv){
                            prop = pv.data_var;
                            d.properties[prop] = d2[prop];
                        })
                        
                        d.properties.n_urban_pop = d2.n_urban_pop;
                        d.properties.n_total_pop = d2.n_urban_pop + d2.n_rural_pop + d2.n_rural_tr_pop;

                        if(categoryCall == "PHC_AVL"){
                            Total += d2.desiredPHC - d2.shortagePHC;
                            Desired += d2.desiredPHC;
                        }else if(categoryCall == "SC_AVL"){
                            Total += d2.desiredSC - d2.shortageSC;
                            Desired += d2.desiredSC;
                        }else if(categoryCall == "CHC_AVL"){
                            Total += d2.desiredCHC - d2.shortageCHC;
                            Desired += d2.desiredCHC;
                        }

                        if(categoryCall == "SC_ACCESSIBILITY" || categoryCall == "PHC_ACCESSIBILITY"){
                            TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];

                            TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v];

                            TotalInfoVillage += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v] + d2[PlotCategory[categoryCall].reqVar[5].v];
                        }else if(categoryCall == "CHC_ACCESSIBILITY"){
                             TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];

                            TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v];

                            TotalInfoVillage += d2[PlotCategory[categoryCall].reqVar[2].v] + d2[PlotCategory[categoryCall].reqVar[3].v] + d2[PlotCategory[categoryCall].reqVar[4].v] + d2[PlotCategory[categoryCall].reqVar[5].v];
                        }else{
                            TotalRuralPop += d2[PlotCategory[categoryCall].reqVar[1].v];
                            TotalRuralTribalPop += d2[PlotCategory[categoryCall].reqVar[2].v];
                            
                        }
                        TotalUrbanPopulation += d2.n_urban_pop;
                        TotalPopulation += d.properties.n_total_pop;
                      }
                    })
               })
           }else{
             //Consolidating the STATE data in one file
             STATEDistrictTopo.objects['2011_Dist'].geometries.forEach(function(d,i){
               
                var ST_NM = STATE;
                if(d.properties.ST_NM != ST_NM)
                {
                    delete STATEDistrictTopo.objects['2011_Dist'].geometries[i];
                }else{
                    
                     }
                 })
            }
       
           d3.select(window).on('resize',function(){
                if(prevHeight < height){
                    
                     {fontSize = 10*(   height/prevHeight);}
                    
                 }else if(prevHeight > height){
                     
                      {fontSize = 10*(height/prevHeight);}
                 }else if(prevWidth < width){
                     
                     {fontSize = 10*(width/prevWidth);}
                 }else if(prevWidth > width){
                     
                      {fontSize = 10*(width/prevWidth);}
                 }
            width = parseInt(d3.select('#chart-area').style('width'))
            width = width - margin.left - margin.right;
            height = width*mapRatio;
                
            createState(currentStatePlot,currentCategoryPlot);
            
            })
       
        InfoRuralPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
        InfoRuralTribalPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
        InfoUrbanPopulation.style("font-size",(fontSize*infoBoxPopulationFontRatio)+'px')
            
        
        if(stateNameCall == 'India_state' && PlotCategory[categoryCall].plotType == "DIST"){
            dynamicPlotINDIA_Comp()     
        }else if(stateNameCall == 'India_state' && PlotCategory[categoryCall].plotType == "percent"){
            dynamicPlotINDIA_Percentage()     
        }else if(stateNameCall == 'India_state' && PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY"){
            dynamicPlot_INDIA_NON_COMP_QUALITY()   
        }else if(PlotCategory[categoryCall].plotType == "QUALITY_INDEX"){
            dynamicPlot_HMIS_INDEX()   
        }else if(PlotCategory[categoryCall].plotType == "NON_COMP_QUALITY" && stateNameCall != 'India_state'){
            dynamicPlot_STATE_NON_COMP_QUALITY();
        }else if(PlotCategory[categoryCall].plotType == "NON_COMP" && stateNameCall == 'India_state'){
            dynamicPlotINDIA_NON_COMP();
        }else{
            dynamicPlotSTATES();
        }
        
       
        var infoDataMargin_left = 120;
        var infoDataMargin_top = 140;
       
       
        //Plotting the main data map
        function dynamicPlotINDIA_Comp()
            {
                var sht = apiVAR[0].data_var
                var dsr = apiVAR[3].data_var
                
                $("#DENOMINATOR").text(PlotCategory[categoryCall].denom_head)
                $("#NUMERATOR").text(PlotCategory[categoryCall].num_head)
                
                console.log("DYNAMIC_PLOT : ",sht + ": " + dsr)
                
                //$("#ACCESSIBILITY").show();
                $("#AVL").show();
                
                console.log(plotVarDef[plotVar.v].description.main_head)
                
                console.log("Myplot var : ",plotVar.v)
                
                projectionState = d3.geo.mercator()
                             .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                pathState = d3.geo.path().projection(projectionState);
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                InfoStateName.text("INDIA".toUpperCase())
                InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                InfoUrbanPopulationHead.text("Total Urban Population")
                
                InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                    
                         
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(Desired))
                        InfoExisting.text(numberWithCommas(Total))
                        if(Desired - Total > 0){
                            //Changing the formula to {(Existing - Desired) / Desired}
                            InfoShortageLabel.text("Shortage (%)")
                            
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((Desired-Total)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Desired-Total)*100/Desired).toFixed(0)+"%")
                            }
                            
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                return (140*Total/Desired) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })
                            InfoShortage.style('color','#D96331')
                        }else{
                            //Changing the formula to {(Existing - Desired) / Desired}
                            InfoShortageLabel.text("Surplus (%)")
                            
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((Total-Desired)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Total-Desired)*100/Desired).toFixed(0)+"%")
                            }
                            
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                 return (140*Desired/Total) + 'px';
                            })
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoShortage.style('color','#460')
                        }
           
                canvas = d3.select('#chart-area').append('svg')
                    .attr('height',height)
                    .attr('width',width)
                    .style('background',"white")
             
                var g = canvas.append("g");
                
                outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                    .style('fill','#A6BDDB')
                .attr('stroke', 'white')
                .on('mouseover',function(d){
                    d3.select(this).style('opacity',"0.7")
                    })
                .on('mouseout',function(){
                    d3.select(this).style('opacity',"1")
                    })
                .on('click',function(d){
                    
                      if(d.properties.ST_NM != 'Telangana'){
                            currentStatePlot = d.properties.ST_NM;
                            createState(d.properties.ST_NM,currentCategoryPlot);   
                      }
                })
                
            
              stateNameData = g.append("g")
                        .selectAll("text")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                        .enter()
                        .append("text")
                        .attr("d", pathState)
                        .attr("class", "statesNames")
                        .text(function(d){
                            if(d != undefined)
                                {
                                    return d.properties.ST_NM;
                                }
                         })
                       .attr("transform", function(d) { 
                            var centroid = pathState.centroid(d);
                            if(d.properties.ST_NM == 'Daman & Diu')
                            {
                                    return "translate(" + (centroid[0]-42) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'Punjab')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'West Bengal')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Jammu & Kashmir')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Madhya Pradesh')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Maharashtra')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Karnataka')
                            {
                            return "translate(" + (centroid[0]-30) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Andhra Pradesh')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Kerala')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Bihar')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Uttar Pradesh')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Jharkhand')
                            {
                            return "translate(" + (centroid[0]-17) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Arunanchal Pradesh')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Assam')
                            {
                            return "translate(" + (centroid[0]-40) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Meghalaya')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Nagaland')
                            {
                            return "translate(" + (centroid[0]+3) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Manipur')
                            {
                            return "translate(" + (centroid[0]) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Tripura')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Mizoram')
                            {
                            return "translate(" + (centroid[0]+2) + "," + (centroid[1]) + ")"
                            }
                            return "translate(" + (centroid[0]-15) + "," + centroid[1] + ")"
                        })
                        .attr("font-family", "helvetica")
                        .attr("font-size", (fontSize-3)+"px")
                        .attr("font-style", "bold")
                        .attr("fill", "black")
                
                
                    outlineMap.style('fill',function(d,i){
                    if(d == undefined || d.properties[sht] == undefined || d.properties[dsr]==undefined){
                        /*if(STATE == 'Andhra Pradesh' || STATE == 'Telangana'){
                            return "#FFF";
                        }*/
                        return color_PHC_shortage_STATE_2011[4];
                    }
                    else{ 
                        //Changing the formula to {(Existing - Desired) / Desired}
                        if(d.properties[sht] > 0){
                            if(((d.properties[sht])*100/(d.properties[dsr])).toFixed(0) <= 25){
                                //console.log("Color limit ",((d.properties[sht])*100/(d.properties[dsr]-d.properties[sht])))
                                return plotVarDef[plotVar.v].limit.l4.c;
                            }else{
                                return plotVarDef[plotVar.v].limit.l3.c;
                            }
                        }
                        else if(d.properties[sht] <= 0){
                            if(((d.properties[sht]*-1)*100/(d.properties[dsr])).toFixed(0) <= 25){
                                return plotVarDef[plotVar.v].limit.l2.c;
                            }else{
                                return plotVarDef[plotVar.v].limit.l1.c;
                            } 
                        }
                    }
                 })
               .on('mouseover',function(d){
                
                d3.select(this).style('opacity',"0.6")
                    if(d.properties.ST_NM == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                        //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                    }else
                    if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                         MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                        //InfoStateName.text("Delhi".toUpperCase())
                    }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                        //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                    }
                    
                    if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                             if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoUrbanPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                        InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                    
                        {
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                 //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(d.properties.ST_NM.toUpperCase())
                            }
                            //InfoStateName.text(d.properties.ST_NM.toUpperCase());
                        }
                        
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        InfoRuralTribalPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[2].v]))
                        InfoUrbanPopulation.text(numberWithCommas(d.properties.n_urban_pop));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(d.properties[dsr]))
                        InfoExisting.text(numberWithCommas( d.properties[dsr] - d.properties[sht]))
                        if(d.properties[sht] > 0){
                            InfoShortageLabel.text("Shortage (%)")
                             //Changing the formula to {(Existing - Desired) / Desired}
                            if(d.properties[dsr] == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((d.properties[sht])*100/(d.properties[dsr])))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((d.properties[sht])*100/(d.properties[dsr])).toFixed(0)+"%")
                            }
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })

                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140*(d.properties[dsr] - d.properties[sht])/d.properties[dsr]) + 'px';
                            })

                            InfoShortage.style('color','#D96331')
                        }else{
                             //Changing the formula to {(Existing - Desired) / Desired}
                            InfoShortageLabel.text("Surplus (%)")
                            if(d.properties[dsr] == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((d.properties[sht]*-1)*100/(d.properties[dsr])))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((d.properties[sht]*-1)*100/(d.properties[dsr])).toFixed(0)+"%")
                            }
                            
                             InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                //////console.log(140*TotalPHC2016/DesiredPHC)
                                 return (140*d.properties[dsr]/(d.properties[dsr] - d.properties[sht])) + 'px';
                            })

                            InfoShortage.style('color','#460')
                        }
                    }
                 }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select(this).style('opacity',"1")
                    
                        InfoRequiredLabel.text("Required")
                        InfoExistingLabel.text("Existing")
                        InfoRequired.style('background','#A5B3A4')
                        InfoExisting.style('background','#BFDFF1')
                    
                         if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else 
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoRequired.text(numberWithCommas(Desired))
                        InfoExisting.text(numberWithCommas(Total))
                        if(Desired - Total > 0){
                             //Changing the formula to {(Existing - Desired) / Desired}
                            InfoShortageLabel.text("Shortage (%)")
                            
                            if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((Desired-Total)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Desired-Total)*100/Desired).toFixed(0)+"%")
                            }
                            
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                return (140*Total/Desired) + 'px';
                            })
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                 return (140) + 'px';
                            })
                            InfoShortage.style('color','#D96331')
                        }else{
                            InfoShortageLabel.text("Surplus (%)")
                             //Changing the formula to {(Existing - Desired) / Desired}
                             if(Desired == 0)
                            {
                                InfoShortage.text("");
                            }
                            else if(isNaN((Total-Desired)*100/Desired))
                            {
                                InfoShortage.text("NA")

                            }else{
                                InfoShortage.text(((Total-Desired)*100/Desired).toFixed(0)+"%")
                            }
                            
                            
                            InfoRequired
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                ////console.log(140*Total/Desired)
                                 return (140*Desired/Total) + 'px';
                            })
                            InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (140) + 'px';
                            })
                            InfoShortage.style('color','#460')
                        }
                     })

                    //d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                    d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                    d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                    d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                    d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                    d3.select("#d1").text("> 25%");
                    d3.select("#d2").text("0 - 25%");
                    d3.select("#d3").text("0 - 25%");
                    d3.select("#d4").text("> 25%");
        }
       
       
      function dynamicPlotINDIA_NON_COMP()
      { 
          $("#legends").hide();
          console.log("NON_COMP is called")
          MainHeading.text(plotVarDef[plotVar.v].description.main_head +" : INDIA")
          
          $("#AVL").show();
               
               
                legendsData.style('visibility','visible')
                
                canvas = d3.select('#chart-area').append('svg')
                   .attr('width',width)
                    .style('background',"#fff")
                    .attr('height',width*.65)
                
                var projectionState = d3.geo.mercator()
                               .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                var pathState = d3.geo.path().projection(projectionState);
                 $("#CAVEAT_ROW").hide()
                 d3.select("#CAVEAT").text("")
                 
                InfoStateName.text("INDIA")
                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                InfoUrbanPopulationHead.text("Total Urban Population")
                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)

                //InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")
                InfoExisting.text(Total)
                InfoRequired.text("")
                InfoRequired.style('background','#fff')
                InfoExisting.style('background','#fff')
                InfoRequiredLabel.text("")
                InfoExistingLabel.text("No. of Hospitals")
                InfoShortageLabel.text("")
                InfoShortage.text("")
                
                
                
              var centered,zoomState=0;
              var g = canvas.append("g");
              
              outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                    .style('fill','#A6BDDB')
                    .attr('stroke', 'white')
                    .on('mouseover',function(d){
                        d3.select(this).style('opacity',"0.7")
                        })
                    .on('mouseout',function(){
                        d3.select(this).style('opacity',"1")
                        })
                    .on('click',function(d){
                          if(d.properties.ST_NM != 'Telangana'){
                            currentStatePlot = d.properties.ST_NM;
                            createState(d.properties.ST_NM,currentCategoryPlot);   
                          }
                    })
                
            
              stateNameData = g.append("g")
                        .selectAll("text")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                        .enter()
                        .append("text")
                        .attr("d", pathState)
                        .attr("class", "statesNames")
                        .text(function(d){
                            if(d != undefined)
                                {
                                    return d.properties.ST_NM;
                                }
                         })
                       .attr("transform", function(d) { 
                            var centroid = pathState.centroid(d);
                            if(d.properties.ST_NM == 'Daman & Diu')
                            {
                                    return "translate(" + (centroid[0]-42) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'Punjab')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'West Bengal')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Jammu & Kashmir')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Madhya Pradesh')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Maharashtra')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Karnataka')
                            {
                            return "translate(" + (centroid[0]-30) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Andhra Pradesh')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Kerala')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Bihar')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Uttar Pradesh')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Jharkhand')
                            {
                            return "translate(" + (centroid[0]-17) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Arunanchal Pradesh')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Assam')
                            {
                            return "translate(" + (centroid[0]-40) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Meghalaya')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Nagaland')
                            {
                            return "translate(" + (centroid[0]+3) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Manipur')
                            {
                            return "translate(" + (centroid[0]) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Tripura')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Mizoram')
                            {
                            return "translate(" + (centroid[0]+2) + "," + (centroid[1]) + ")"
                            }
                            return "translate(" + (centroid[0]-15) + "," + centroid[1] + ")"
                        })
                        .attr("font-family", "helvetica")
                        .attr("font-size", (fontSize-3)+"px")
                        .attr("font-style", "bold")
                        .attr("fill", "black")
                       .on('mouseover',function(d){
                  
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI'){
                                 MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                //InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                            }
                    //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +d.properties.ST_NM)
                    d3.select(this).style('opacity',"0.6")
                     if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI'){
                                 //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(d.properties.ST_NM.toUpperCase())
                            }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                          if(d.properties.ST_NM == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI'){
                                 //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(d.properties.ST_NM.toUpperCase())
                            }
                          
                        //InfoStateName.text(d.properties.ST_NM.toUpperCase())
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                       
                         InfoExistingLabel.text("No. of Hospitals")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                         InfoUrbanPopulation.text(numberWithCommas(d.properties.n_urban_pop));
                         InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                       
                        InfoExisting.text(d.properties[PlotCategory[categoryCall].reqVar[0].v])
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                       
                      }
                }).on('mouseout',function(d){
                     MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                     d3.select(this).style('opacity',"1")
                         $("#CAVEAT_ROW").hide()
                         d3.select("#CAVEAT").text("")
                        
                         if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                       
                        InfoExisting.text(Total)

                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("No. of Hospitals")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        
                   
                })
                 
               outlineMap.on('mouseover',function(d){
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                //InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                 MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                //InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                //InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                            }
                   
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +d.properties.ST_NM)
                    d3.select(this).style('opacity',"0.6")
                     if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                 
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                            }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoUrbanPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                           if(d.properties.ST_NM == "Andhra Pradesh"){
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                 
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                            }
                          
                        InfoStateName.text(d.properties.ST_NM.toUpperCase())
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                       
                         InfoExistingLabel.text("No. of Hospitals")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                         InfoUrbanPopulation.text(numberWithCommas(d.properties.n_urban_pop));
                         InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                       
                        InfoExisting.text(d.properties[PlotCategory[categoryCall].reqVar[0].v])
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                       
                      }
                }).on('mouseout',function(d){
                     MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                     d3.select(this).style('opacity',"1")
                         $("#CAVEAT_ROW").hide()
                         d3.select("#CAVEAT").text("")
                        
                         if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalUrbanPopulation));
                        InfoUrbanPopulationHead.text("Total Urban Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                       
                        InfoExisting.text(Total)

                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("No. of Hospitals")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        
                   
                })
         }
       
       
       
      function dynamicPlotINDIA_Percentage()
      { 
          MainHeading.text(plotVarDef[plotVar.v].description.main_head +" : INDIA")
               
           legendsData.style('visibility','visible')
          
                //$("#ACCESSIBILITY").show();
                $("#AVL").show();
          
            $("#DENOMINATOR").text(PlotCategory[categoryCall].denom_head)
            $("#NUMERATOR").text(PlotCategory[categoryCall].num_head)
                
                canvas = d3.select('#chart-area').append('svg')
                   .attr('width',width)
                    .style('background',"#fff")
                    .attr('height',width*.65)
                
                var projectionState = d3.geo.mercator()
                               .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                var pathState = d3.geo.path().projection(projectionState);
                 $("#CAVEAT_ROW").hide()
                 d3.select("#CAVEAT").text("")
                
                InfoStateName.text("INDIA".toUpperCase())
          
                if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                        
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text("");
                        InfoUrbanPopulationHead.text("")
                        InfoHealthCategoryName.text("")                        
                        InfoExisting.text("")
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }else{
                       
                        InfoStateName.text("INDIA".toUpperCase())
                        InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                        InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                        InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                        InfoUrbanPopulationHead.text("Total Population")
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                        })
                       
                        InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        InfoExistingLabel.text("Percent")
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                }
                
                
              var centered,zoomState=0;
              var g = canvas.append("g");
              
              outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                    .style('fill','#A6BDDB')
                .attr('stroke', 'white')
                .on('mouseover',function(d){
                    d3.select(this).style('opacity',"0.7")
                    })
                .on('mouseout',function(){
                    d3.select(this).style('opacity',"1")
                    })
                .on('click',function(d){
                      if(d.properties.ST_NM != 'Telangana'){
                        currentStatePlot = d.properties.ST_NM;
                        createState(d.properties.ST_NM,currentCategoryPlot);   
                      }
                })
                
            
              stateNameData = g.append("g")
                        .selectAll("text")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                        .enter()
                        .append("text")
                        .attr("d", pathState)
                        .attr("class", "statesNames")
                        .text(function(d){
                            if(d != undefined)
                                {
                                    return d.properties.ST_NM;
                                }
                         })
                       .attr("transform", function(d) { 
                            var centroid = pathState.centroid(d);
                            if(d.properties.ST_NM == 'Daman & Diu')
                            {
                                    return "translate(" + (centroid[0]-42) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'Punjab')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'West Bengal')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Jammu & Kashmir')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Madhya Pradesh')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Maharashtra')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Karnataka')
                            {
                            return "translate(" + (centroid[0]-30) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Andhra Pradesh')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Kerala')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Bihar')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Uttar Pradesh')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Jharkhand')
                            {
                            return "translate(" + (centroid[0]-17) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Arunanchal Pradesh')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Assam')
                            {
                            return "translate(" + (centroid[0]-40) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Meghalaya')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Nagaland')
                            {
                            return "translate(" + (centroid[0]+3) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Manipur')
                            {
                            return "translate(" + (centroid[0]) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Tripura')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Mizoram')
                            {
                            return "translate(" + (centroid[0]+2) + "," + (centroid[1]) + ")"
                            }
                            return "translate(" + (centroid[0]-15) + "," + centroid[1] + ")"
                        })
                        .attr("font-family", "helvetica")
                        .attr("font-size", (fontSize-3)+"px")
                        .attr("font-style", "bold")
                        .attr("fill", "black")
                        .on('mouseover',function(d){
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Andhra Pradesh *")
                            }
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                    MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Delhi")
                            }if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                    MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Arunachal Pradesh")
                            }else{
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                            }
                            d3.select(this).style('opacity',"0.6")
                         if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                             if(d.properties.ST_NM == "Andhra Pradesh"){
                                    InfoStateName.text("Andhra Pradesh*".toUpperCase())
                                }
                                if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                        InfoStateName.text("Delhi".toUpperCase())
                                }if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                                }else{
                                    InfoStateName.text(d.properties.ST_NM.toUpperCase())
                                }
                             
                            
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                    InfoStateName.text("Andhra Pradesh*".toUpperCase())
                                }
                                if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                        InfoStateName.text("Delhi".toUpperCase())
                                }if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                                }else{
                                    InfoStateName.text(d.properties.ST_NM.toUpperCase())
                                }
                             
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC'){  
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])))
                            
                        InfoExistingLabel.text("Percent*");
                            
                        }else if(plotVar.v == 'p_within10_CHC'){
                            
                        InfoExistingLabel.text("Percent*")
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])))
                            
                        }else{
                            
                         InfoExistingLabel.text("Percent")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                        InfoUrbanPopulation.text(numberWithCommas(d.properties.n_total_pop));
                        InfoUrbanPopulationHead.text("Total Population")
                            
                        }
                          
                          
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]).toFixed(0)+"%")
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                          
                      
                      }
                }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select(this).style('opacity',"1")
                     
                         $("#CAVEAT_ROW").hide()
                         d3.select("#CAVEAT").text("")
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                                InfoStateName.text("INDIA".toUpperCase())
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoUrbanPopulation.text("");
                                InfoUrbanPopulationHead.text("")
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                                InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                                InfoUrbanPopulationHead.text("Total Population")
                                InfoExisting
                                      .transition()
                                      .duration(200)
                                      .style('width',function(){
                                        return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                                })

                                InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")

                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#BFDFF1')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("Percent")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                })
          
                
                 outlineMap
                  .attr('stroke', 'white')
                  .style('fill',function(d,i){
                        
                   if(d == undefined || d.properties[plotVar.v] == undefined){
                        return '#445'//colorAccessSubCenter_STATE_gt_5km[4];
                    }
                    else if(d.properties[plotVar.v].toFixed(0) >= plotVarDef[plotVar.v].limit.l4.l && d.properties[plotVar.v].toFixed(0)<= plotVarDef[plotVar.v].limit.l4.r){
                        return plotVarDef[plotVar.v].limit.l4.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l3.l && d.properties[plotVar.v].toFixed(0) <=plotVarDef[plotVar.v].limit.l3.r){
                        return plotVarDef[plotVar.v].limit.l3.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l2.l && d.properties[plotVar.v].toFixed(0)<=plotVarDef[plotVar.v].limit.l2.r){
                        return plotVarDef[plotVar.v].limit.l2.c;
                    }else if(d.properties[plotVar.v].toFixed(0) >=plotVarDef[plotVar.v].limit.l1.l ){
                        return plotVarDef[plotVar.v].limit.l1.c;
                    }else{
                        return '#000'
                    }
                 })
                 .on('mouseover',function(d){
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Andhra Pradesh *")
                            }
                            if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                    MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Delhi")
                            }if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                    MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Arunachal Pradesh")
                            }else{
                                MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                            }
                            d3.select(this).style('opacity',"0.6")
                         if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                             if(d.properties.ST_NM == "Andhra Pradesh"){
                                    InfoStateName.text("Andhra Pradesh*".toUpperCase())
                                }
                                if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                        InfoStateName.text("Delhi".toUpperCase())
                                }if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                                }else{
                                    InfoStateName.text(d.properties.ST_NM.toUpperCase())
                                }
                             
                            
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                            if(d.properties.ST_NM == "Andhra Pradesh"){
                                    InfoStateName.text("Andhra Pradesh*".toUpperCase())
                                }
                                if(d.properties.ST_NM.toUpperCase() == 'NCT OF DELHI' || d.properties.ST_NM.toUpperCase() == 'DELHI'){
                                        InfoStateName.text("Delhi".toUpperCase())
                                }if(d.properties.ST_NM.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                        InfoStateName.text("Arunachal Pradesh".toUpperCase())
                                }else{
                                    InfoStateName.text(d.properties.ST_NM.toUpperCase())
                                }
                             
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within5_PHC'){  
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])))
                            
                        InfoExistingLabel.text("Percent*");
                            
                        }else if(plotVar.v == 'p_within10_CHC'){
                            
                        InfoExistingLabel.text("Percent*")
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[3].v])+parseFloat(d.properties[PlotCategory[categoryCall].reqVar[4].v])))
                            
                        }else{
                            
                         InfoExistingLabel.text("Percent")
                            
                         InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                        InfoUrbanPopulation.text(numberWithCommas(d.properties.n_total_pop));
                        InfoUrbanPopulationHead.text("Total Population")
                            
                        }
                          
                          
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]).toFixed(0)+"%")
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#BFDFF1')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")

                      }
                   }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select(this).style('opacity',"1")
                     
                         $("#CAVEAT_ROW").hide()
                         d3.select("#CAVEAT").text("")
                        if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                                InfoStateName.text("INDIA".toUpperCase())
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoUrbanPopulation.text("");
                                InfoUrbanPopulationHead.text("")
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                                InfoUrbanPopulation.text(numberWithCommas(TotalPopulation));
                                InfoUrbanPopulationHead.text("Total Population")
                                InfoExisting
                                      .transition()
                                      .duration(200)
                                      .style('width',function(){
                                        return (1.40*(TotalRuralTribalPop/TotalRuralPop)*100)+'px';
                                })

                                InfoExisting.text((TotalRuralTribalPop/TotalRuralPop*100).toFixed(0)+"%")

                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#BFDFF1')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("Percent")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                  })

                if(currentCategoryPlot == "SDH_AVL" || currentCategoryPlot == "DH_AVL"){
                    $("#legends").hide()
                }
                
                    d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                    d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                    d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                    d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                    d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                if(plotVarDef[plotVar.v].limit.l1.r == 100){
                    d3.select("#d4").text("< "+plotVarDef[plotVar.v].limit.l4.r+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("> " + plotVarDef[plotVar.v].limit.l1.l+"%");
                }else{
                    d3.select("#d4").text("> "+ plotVarDef[plotVar.v].limit.l4.l+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("< "+ plotVarDef[plotVar.v].limit.l1.r+"%");
                }
         }
       
            
        //Plotting the main data map
        function dynamicPlot_INDIA_NON_COMP_QUALITY()
            {
                console.log(plotVarDef[plotVar.v].description.main_head)
                
                //$("#ACCESSIBILITY").show();
                $("#AVL").show();
                
                console.log("Myplot var : ",plotVar.v)
                
                if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                   STATE == 'DELHI'
                }if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                    STATE == 'ARUNACHAL PRADESH'
                }
                
                hideXtra();
                if(typeVar == 'HR'){
                    InfoStateName.text("Human Resources")
                    displayHR(myQObj);
                }else if(typeVar == 'INFRA'){
                    InfoStateName.text("Infrastructure")
                    displayINFRA(myQObj);
                }else if(typeVar == 'SUPPLY'){
                    InfoStateName.text("Supply")
                    displaySUPPLY(myQObj);
                }
                
                projectionState = d3.geo.mercator()
                             .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                pathState = d3.geo.path().projection(projectionState);
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
           
                canvas = d3.select('#chart-area').append('svg')
                    .attr('height',height)
                    .attr('width',width)
                    .style('background',"white")
             
                var g = canvas.append("g");
                
                outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                    .style('fill','#A6BDDB')
                .attr('stroke', 'white')
                .on('mouseover',function(d){
                    d3.select(this).style('opacity',"0.7")
                        if(typeVar == 'HR'){
                        InfoStateName.text("Human Resources : " + d.properties.ST_NM)
                        displayHR(d.properties);
                        }else if(typeVar == 'INFRA'){
                            InfoStateName.text("Infrastructure : " + d.properties.ST_NM)
                            displayINFRA(d.properties);
                        }else if(typeVar == 'SUPPLY'){
                            InfoStateName.text("Supply : " + d.properties.ST_NM)
                            displaySUPPLY(d.properties);
                        }
                    
                    })
                .on('mouseout',function(){
                    d3.select(this).style('opacity',"1")
                        if(typeVar == 'HR'){
                        InfoStateName.text("Human Resources")
                        displayHR(myQObj);
                        }else if(typeVar == 'INFRA'){
                            InfoStateName.text("Infrastructure")
                            displayINFRA(myQObj);
                        }else if(typeVar == 'SUPPLY'){
                            InfoStateName.text("Supply")
                            displaySUPPLY(myQObj);
                        }
                    })
                .on('click',function(d){
                    
                    if(d.properties.ST_NM != 'Telangana'){
                        currentStatePlot = d.properties.ST_NM;
                        createState(d.properties.ST_NM,currentCategoryPlot);   
                    }
                })
                
            
            stateNameData = g.append("g")
                        .selectAll("text")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                        .enter()
                        .append("text")
                        .attr("d", pathState)
                        .attr("class", "statesNames")
                        .text(function(d){
                            if(d != undefined)
                                {
                                   
                                    if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                            return "Delhi";
                                    }if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                            return "Arunachal Pradesh";
                                    }else{
                                        return d.properties.ST_NM;
                                    }
                                    
                                }
                         })
                       .attr("transform", function(d) { 
                            var centroid = pathState.centroid(d);
                            if(d.properties.ST_NM == 'Daman & Diu')
                            {
                                    return "translate(" + (centroid[0]-42) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'Punjab')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'West Bengal')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Jammu & Kashmir')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Madhya Pradesh')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Maharashtra')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Karnataka')
                            {
                            return "translate(" + (centroid[0]-30) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Andhra Pradesh')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Kerala')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Bihar')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Uttar Pradesh')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Jharkhand')
                            {
                            return "translate(" + (centroid[0]-17) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Arunanchal Pradesh')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Assam')
                            {
                            return "translate(" + (centroid[0]-40) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Meghalaya')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Nagaland')
                            {
                            return "translate(" + (centroid[0]+3) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Manipur')
                            {
                            return "translate(" + (centroid[0]) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Tripura')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Mizoram')
                            {
                            return "translate(" + (centroid[0]+2) + "," + (centroid[1]) + ")"
                            }
                            return "translate(" + (centroid[0]-15) + "," + centroid[1] + ")"
                        })
                        .attr("font-family", "helvetica")
                        .attr("font-size", (fontSize-3)+"px")
                        .attr("font-style", "bold")
                        .attr("fill", "black")
                        .on('mouseover',function(d){
                            d3.select(this).style('opacity',"0.7")
                                console.log("This is the state data",d.properties)
                                if(typeVar == 'HR'){
                               InfoStateName.text("Human Resources")
                                displayHR(d.properties);
                                }else if(typeVar == 'INFRA'){
                                    InfoStateName.text("Infrastructure")
                                    displayINFRA(d.properties);
                                }else if(typeVar == 'SUPPLY'){
                                    InfoStateName.text("Supply")
                                    displaySUPPLY(d.properties);
                                }

                            })
                        .on('mouseout',function(){
                            d3.select(this).style('opacity',"1")
                                if(typeVar == 'HR'){
                                InfoStateName.text("Human Resources")
                                displayHR(myQObj);
                                }else if(typeVar == 'INFRA'){
                                    InfoStateName.text("Infrastructure")
                                    displayINFRA(myQObj);
                                }else if(typeVar == 'SUPPLY'){
                                    InfoStateName.text("Supply")
                                    displaySUPPLY(myQObj);
                                }
                            })
                        .on('click',function(d){
                            
                            if(d.properties.ST_NM != 'Telangana'){
                                currentStatePlot = d.properties.ST_NM;
                                createState(d.properties.ST_NM,currentCategoryPlot);   
                            }
                        })
                
             function displayHR(d){
                    
                  if(PlotCategory[categoryCall].hr.length == 0){
                      InfoHealthCategoryName.text("Data Not Available")
                  }else{    
                      InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                  }
                
                  for(var i = 0 ; i < PlotCategory[categoryCall].hr.length ; i++){
                    var var_name = PlotCategory[categoryCall].hr[i];
                   
                        
                        $("#LABEL_"+(i+1)).show();
                        $("#VALUE_"+(i+1)).show();
                        d3.select("#LABEL_"+(i+1)).text(PlotCategory[categoryCall].hr_label[i])
                         if(d[var_name] == null){
                            d3.select("#VALUE_"+(i+1)).text("NA")
                            d3.select("#VALUE_"+(i+1)).style('color','black')
                        }else{
                            
                            if((1-d[var_name]) >= 0){
                                d3.select("#VALUE_"+(i+1)).text(((1-d[var_name])*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','#D96331')
                            }else{
                                d3.select("#VALUE_"+(i+1)).text(((d[var_name]-1)*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','green')
                         }
                     }
                  }
                
                }
           
               function displayINFRA(d){
                   
                  if(PlotCategory[categoryCall].infra.length == 0){
                      InfoHealthCategoryName.text("Data Not Available")
                  }else{
                      InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                  }
                   
                   
                if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                   STATE == 'DELHI'
                }if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                    STATE == 'ARUNACHAL PRADESH'
                }
                   
                 for(var i = 0 ; i < PlotCategory[categoryCall].infra.length ; i++){
                    var var_name = PlotCategory[categoryCall].infra[i];
                   
                        
                        $("#LABEL_"+(i+1)).show();
                        $("#VALUE_"+(i+1)).show();
                        d3.select("#LABEL_"+(i+1)).text(PlotCategory[categoryCall].infra_label[i])
                         if(d[var_name] == null){
                            d3.select("#VALUE_"+(i+1)).text("NA")
                            d3.select("#VALUE_"+(i+1)).style('color','black')
                        }else{
                            
                            if((1-d[var_name]) >= 0){
                                d3.select("#VALUE_"+(i+1)).text(((1-d[var_name])*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','#D96331')
                            }else{
                                d3.select("#VALUE_"+(i+1)).text(((d[var_name]-1)*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','green')
                            }
                      }
                  }
                }
           
                function displaySUPPLY(d){
                    
                  if(PlotCategory[categoryCall].supply.length == 0){
                      InfoHealthCategoryName.text("Data Not Available")
                  }else{
                      InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                  } 
                    
                  for(var i = 0 ; i < PlotCategory[categoryCall].supply.length ; i++){
                    var var_name = PlotCategory[categoryCall].supply[i];
                    
                        $("#LABEL_"+(i+1)).show();
                        $("#VALUE_"+(i+1)).show();
                        d3.select("#LABEL_"+(i+1)).text(PlotCategory[categoryCall].supply_label[i])
                         if(d[var_name] == null){
                            d3.select("#VALUE_"+(i+1)).text("NA")
                            d3.select("#VALUE_"+(i+1)).style('color','black')
                        }else{
                            
                            if((1-d[var_name]) >= 0){
                                d3.select("#VALUE_"+(i+1)).text(((1-d[var_name])*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','#D96331')
                            }else{
                                d3.select("#VALUE_"+(i+1)).text(((d[var_name]-1)*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','green')
                            }
                     }
                  }
                }
                
             

        }
       
       //Plotting the State map
       function dynamicPlotSTATES()
            {
                
                if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                   STATE == 'DELHI'
                }if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                    STATE == 'ARUNACHAL PRADESH'
                }
                
                console.log(plotVarDef[plotVar.v].description.main_head)
                
                console.log("Myplot var : ",plotVar.v)
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                
                projectionState = d3.geo.mercator()
                              .translate([-width*GEOM_WIDTH_R, height*GEOM_HEIGHT_R])
                              .scale([width*GEOM_SCALE_R]);
                pathState = d3.geo.path().projection(projectionState);
           
                canvas = d3.select('#chart-area').append('svg')
                    .attr('height',height)
                    .attr('width',width)
                    .style('background',"white")
             
                var g = canvas.append("g");
                
                outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                    .style('fill','#A6BDDB')
                
                .attr('stroke', 'white')
                
                .on('mouseover',function(d){
                    d3.select(this).style('opacity',"0.7")

                    })
                .on('mouseout',function(){
                    d3.select(this).style('opacity',"1")
                    })
        }
       
       function dynamicPlot_STATE_NON_COMP_QUALITY(){
           
                //$("#ACCESSIBILITY").show();
                $("#AVL").show();
               
                projectionState = d3.geo.mercator()
                              .translate([-width*GEOM_WIDTH_R, height*GEOM_HEIGHT_R])
                              .scale([width*GEOM_SCALE_R]);
                pathState = d3.geo.path().projection(projectionState);
           
                console.log("Check this ",stateAPIData)
           
                if(typeVar == 'HR'){
                    InfoStateName.text("Human Resources")
                }else if(typeVar == 'INFRA'){
                    InfoStateName.text("Infrastructure")
                }else if(typeVar == 'SUPPLY'){
                    InfoStateName.text("Supply")
                }
                
                InfoRuralPopulation.text(stateAPIData[0].n_rural_pop)
                InfoRuralTribalPopulation.text(stateAPIData[0].n_rural_tr_pop)
           
           
                //InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                //Showing the data in the side cloumn
                if(typeVar == 'HR'){
                    displayHR();
                }else if(typeVar == 'INFRA'){
                    displayINFRA();
                }else if(typeVar == 'SUPPLY'){
                    displaySUPPLY();
                }
           
           
                changeinfoStructure();
                function changeinfoStructure(){
                    $("#sub-info").removeClass("col-border");
                    //$("#sub-info-box").hide();
                }
           
                InfoExisting.style('background','#fff')
           
                function displayHR(){
                  hideXtra();  
                  if(PlotCategory[categoryCall].hr.length == 0){
                      InfoHealthCategoryName.text("Data Not Available")
                  }else{    
                      InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                  }
                    
                  for(var i = 0 ; i < PlotCategory[categoryCall].hr.length ; i++){
                    var var_name = PlotCategory[categoryCall].hr[i];
                    
                        $("#LABEL_"+(i+1)).show();
                        $("#VALUE_"+(i+1)).show();
                        d3.select("#LABEL_"+(i+1)).text(PlotCategory[categoryCall].hr_label[i])
                         if(stateAPIData[0][var_name] == null){
                            d3.select("#VALUE_"+(i+1)).text("NA")
                            d3.select("#VALUE_"+(i+1)).style('color','black')
                        }else{
                            
                            if((1-stateAPIData[0][var_name]) >= 0){
                                d3.select("#VALUE_"+(i+1)).text(((1-stateAPIData[0][var_name])*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','#D96331')
                            }else{
                                d3.select("#VALUE_"+(i+1)).text(((stateAPIData[0][var_name]-1)*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','green')
                            }
                        }
                    
                  }
                 
                }
           
               function displayINFRA(){
                  hideXtra(); 
                  if(PlotCategory[categoryCall].infra.length == 0){
                      InfoHealthCategoryName.text("Data Not Available")
                  }else{
                      InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                  }
                   
                   for(var i = 0 ; i < PlotCategory[categoryCall].infra.length ; i++){
                    var var_name = PlotCategory[categoryCall].infra[i];
                    
                        
                        $("#LABEL_"+(i+1)).show();
                        $("#VALUE_"+(i+1)).show();
                        d3.select("#LABEL_"+(i+1)).text(PlotCategory[categoryCall].infra_label[i])
                         if(stateAPIData[0][var_name] == null){
                            d3.select("#VALUE_"+(i+1)).text("NA")
                            d3.select("#VALUE_"+(i+1)).style('color','black')
                        }else{
                            
                            if((1-stateAPIData[0][var_name]) >= 0){
                                d3.select("#VALUE_"+(i+1)).text(((1-stateAPIData[0][var_name])*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','#D96331')
                            }else{
                                d3.select("#VALUE_"+(i+1)).text(((stateAPIData[0][var_name]-1)*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','green')
                            }
                        }
                    
                  }
                }
           
                function displaySUPPLY(){
                  hideXtra();  
                  if(PlotCategory[categoryCall].supply.length == 0){
                      InfoHealthCategoryName.text("Data Not Available")
                  }else{
                      InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                  } 
                    
                  for(var i = 0 ; i < PlotCategory[categoryCall].supply.length ; i++){
                    var var_name = PlotCategory[categoryCall].supply[i];
                        
                        $("#LABEL_"+(i+1)).show();
                        $("#VALUE_"+(i+1)).show();
                        d3.select("#LABEL_"+(i+1)).text(PlotCategory[categoryCall].supply_label[i])
                         if(stateAPIData[0][var_name] == null){
                            d3.select("#VALUE_"+(i+1)).text("NA")
                            d3.select("#VALUE_"+(i+1)).style('color','black')
                        }else{
                            
                            if((1-stateAPIData[0][var_name]) >= 0){
                                d3.select("#VALUE_"+(i+1)).text(((1-stateAPIData[0][var_name])*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','#D96331')
                            }else{
                                d3.select("#VALUE_"+(i+1)).text(((stateAPIData[0][var_name]-1)*100).toFixed(1)+"%")
                                d3.select("#VALUE_"+(i+1)).style('color','green')
                            }
                        }
                    
                  }
                }
                
                var clickID = d3.select("#HR");
                d3.select("#HR").on('click',function(){
                    
                    hideXtra();
                    displayHR()
                    clickID = d3.select(this)
                    
                })
                d3.select("#INFRA").on('click',function(){
                    
                    hideXtra();
                    displayINFRA()
                    clickID = d3.select(this)
                })
                d3.select("#SUPPLY").on('click',function(){
                    
                    hideXtra();
                    displaySUPPLY()
                    clickID = d3.select(this)
                })
               
                
               
                if(STATE == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Andhra Pradesh *")
                    }else
                    if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Delhi")
                    }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Arunachal Pradesh")
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + STATE)
                    }
               
                canvas = d3.select('#chart-area').append('svg')
                    .attr('height',height)
                    .attr('width',width)
                    .style('background',"white")
             
                var g = canvas.append("g");
                
                outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                    .style('fill','#A6BDDB')
                .attr('stroke', 'white')
                .on('mouseover',function(d){
                    d3.select(this).style('opacity',"0.7")
                    })
                .on('mouseout',function(){
                    d3.select(this).style('opacity',"1")
                    })
                .on('click',function(d){
                    
                    /*if(d.properties.ST_NM != 'Telangana'){
                        currentStatePlot = d.properties.ST_NM;
                        createState(d.properties.ST_NM,currentCategoryPlot);   
                    }*/
                })
        }
            
       function dynamicPlotNonComp()
            {
              
                
                console.log(plotVarDef[plotVar.v].description.main_head)
                
                console.log("Myplot var : ",plotVar.v)
                
                MainHeading.text(plotVarDef[plotVar.v].description.main_head)
           
                  {
                        canvas = d3.select('#chart-area').append('svg')
                        .attr('height',height)
                        .attr('width',width)
                        .style('background',"#fff")
                        .attr('width',width)
                   }
                d3.select("#CAVEAT").text("")
                $("#CAVEAT_ROW").hide()
                
              var g = canvas.append("g");
              var centered,zoomState=0;
               outlineMap = g.append("g")
                    .selectAll("path")
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects['2011_Dist']).features)
                    .enter()
                    .append("path")
                    .attr("d", pathState)
                    .attr("class", "states")
                    .attr('stroke-width', 1)
                    .attr('stroke', 'white')
                    .style('fill','#74A9CF')
                  
             
                
              outlineMap
               .on('mouseover',function(d){
                    if(STATE == "Andhra Pradesh"){
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Andhra Pradesh *")
                    }else
                    if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Delhi")
                    }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                            MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + "Arunachal Pradesh")
                    }else{
                        MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + STATE)
                    }
                  
                    
                    d3.select(this).style('opacity',"0.6")
                       if(d == undefined || d.properties[PlotCategory[categoryCall].reqVar[0].v] ==undefined ){
                        
                             if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                            InfoRuralPopulation.text("NA")
                            InfoRuralTribalPopulation.text("NA")
                            InfoHealthCategoryName.text("")
                            InfoExisting.text("")

                            InfoRequired.text("")
                            InfoRequired.style('background','#fff')
                            InfoExisting.style('background','#fff')
                            InfoRequiredLabel.text("")
                            InfoExistingLabel.text("")
                            InfoShortageLabel.text("")
                            InfoShortage.text("")
                      }else if(d != undefined ){
                          
                        if(d.properties.DISTRICT.toUpperCase() == 'Y.S.R'){
                            InfoStateName.text("District : " + "YSR Kadapa")
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Ganganagar'){
                            InfoStateName.text("District : " + "Sri "+d.properties.DISTRICT.toUpperCase());
                        }else if(d.properties.DISTRICT.toUpperCase() == 'Jhunjhunun'){
                            InfoStateName.text("District : " + "Jhunjhunu");
                        }else{
                            InfoStateName.text("District : " + d.properties.DISTRICT.toUpperCase());
                        }
                          
                        InfoRuralPopulation.text(numberWithCommas(d.properties[PlotCategory[categoryCall].reqVar[1].v]))
                       
                        InfoRuralTribalPopulation.text(numberWithCommas(parseFloat(d.properties[PlotCategory[categoryCall].reqVar[2].v])))
                            
                        InfoExistingLabel.text("No. of Hospitals")
                          
                          
                        InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                        InfoExisting
                              .transition()
                              .duration(200)
                              .style('width',function(){
                                return (1.40*d.properties[plotVar.v])+'px';
                        })
                       
                        InfoExisting.text(parseFloat(d.properties[plotVar.v]))
                        
                        InfoRequired.text("")
                        InfoRequired.style('background','#fff')
                        InfoExisting.style('background','#fff')
                        InfoRequiredLabel.text("")
                        
                        InfoShortageLabel.text("")
                        InfoShortage.text("")
                        
                       
                      }
                }).on('mouseout',function(d){
                    MainHeading.text(plotVarDef[plotVar.v].description.main_head)
                    d3.select("#CAVEAT").text("")
                    $("#CAVEAT_ROW").hide()
                    d3.select(this).style('opacity',"1")
                       if(plotVar.v == 'p_within5_SC' || plotVar.v == 'p_within10_CHC' || plotVar.v == 'p_within5_PHC'){
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text("")                        
                                InfoExisting.text("")
                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }else{
                                 if(STATE == "Andhra Pradesh"){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Andhra Pradesh*")
                                InfoStateName.text("Andhra Pradesh*".toUpperCase())
                            }else
                            if(STATE.toUpperCase() == 'NCT OF DELHI' || STATE.toUpperCase() == 'DELHI'){
                                // MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Delhi")
                                InfoStateName.text("Delhi".toUpperCase())
                            }else if(STATE.toUpperCase() == 'ARUNANCHAL PRADESH'){
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " +"Arunachal Pradesh")
                                InfoStateName.text("Arunachal Pradesh".toUpperCase())
                            }else{
                                //MainHeading.text(plotVarDef[plotVar.v].description.main_head + " : " + d.properties.ST_NM)
                                InfoStateName.text(STATE.toUpperCase())
                            }
                                InfoRuralPopulation.text(numberWithCommas(TotalRuralPop))
                                InfoRuralTribalPopulation.text(numberWithCommas(TotalRuralTribalPop))
                                InfoHealthCategoryName.text(plotVarDef[plotVar.v].description.category_head)
                               
                                InfoExisting.text(Total)

                                InfoRequired.text("")
                                InfoRequired.style('background','#fff')
                                InfoExisting.style('background','#fff')
                                InfoRequiredLabel.text("")
                                InfoExistingLabel.text("No. of Hospitals")
                                InfoShortageLabel.text("")
                                InfoShortage.text("")
                        }
                   
                })

                d3.select("#legHead").text(plotVarDef[plotVar.v].description.leg_head);
                d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);
                
                if(plotVarDef[plotVar.v].limit.l1.r == 100){
                    d3.select("#d4").text("< "+plotVarDef[plotVar.v].limit.l4.r+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("> " + plotVarDef[plotVar.v].limit.l1.l+"%");
                }else{
                    d3.select("#d4").text("> "+ plotVarDef[plotVar.v].limit.l4.l+"%");
                    d3.select("#d3").text(plotVarDef[plotVar.v].limit.l3.l+"% - "+ plotVarDef[plotVar.v].limit.l3.r+"%");
                    d3.select("#d2").text(plotVarDef[plotVar.v].limit.l2.l+"% - "+ plotVarDef[plotVar.v].limit.l2.r+"%");
                    d3.select("#d1").text("< "+ plotVarDef[plotVar.v].limit.l1.r+"%");
                }
        }
       
        //Plotting the HMIS Indexes map
        function dynamicPlot_HMIS_INDEX()
            {
                var BIG = [],SMALL = [],UT = [];
                //Categorize the states
                stateAPIData.forEach(function(d){
                     if(d.TYPE == 'state'){
                         BIG.push(d.stateName);
                     }else if(d.TYPE == 'small'){
                         SMALL.push(d.stateName);
                     }else if(d.TYPE == 'UT'){
                         UT.push(d.stateName);
                     }
                })
                UT.push('Andaman & Nicobar Island');
                
                console.log("Sample : ",BIG.indexOf(stateAPIData[5].stateName))
                
                var prev_id = null,prev_id_C = null;
                $("#comming_soon").hide();

                projectionState = d3.geo.mercator()
                             .translate([-width*1.0*1, height*1.0*1.24])
                             .scale([width*1.1*1]);
                pathState = d3.geo.path().projection(projectionState);

                MainHeading.text("Health Infrastructure Index : INDIA")

                if(outlineMap)
                    {
                        outlineMap.remove();
                    }

                canvas = d3.select('#chart-area').append('svg')
                    .attr('height',height)
                    .attr('width',width)
                    .style('background',"white")

                var g = canvas.append("g");


                outlineMap = g.selectAll('path')
                    .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                    .enter().append('path')
                    .attr('d',pathState)
                    .attr('stroke-width', 0.5)
                .attr('stroke', 'white')
                .on('mouseover',function(d){
                    d3.select(this).style('opacity',"0.7")

                    })
                .on('mouseout',function(){
                    d3.select(this).style('opacity',"1")
                    })
                .on('click',function(d){
                     

                })


                $('.INDEX_STATE_SELECT').on('click',function(){
                    //alert()
                    if($(this).attr('id') == 'BIG_STATE_INX'){
                        $("#index_data tr").remove()
                        makeTableBIG(stateAPIData)
                    }else if($(this).attr('id') == 'SMALL_STATE_INX'){
                        $("#index_data tr").remove()
                        makeTableSMALL(stateAPIData)
                    }else if($(this).attr('id') == 'UT_STATE_INX'){
                        $("#index_data tr").remove()
                        makeTableUT(stateAPIData)
                    }

                    console.log("ID obtained :",$(this).attr('id'))
                })


                function makeTableBIG(stateAPIData){
                    console.log(stateAPIData)
                    var data = "";

                    stateAPIData.forEach(function(d){

                        if(d.TYPE == 'state'){
                            data += '<tr id="'+ StateCodeObject[d.stateName] +'_col" onclick="highlight()" style="font-size:10px;"><td class="col-xs-4" >'+ d.stateName +'</td><td class="col-xs-2" style="text-align:right">'+parseFloat(d.HQNI).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right">'+parseFloat(d.HQLI).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right">'+parseFloat(d.HII).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right;">'+d.RANKING+'</td></tr>'
                        }
                        
                        outlineMap.style('fill',function(d,i){
                            if(d == undefined ){
                                return '#cbcbcb'
                            }else if(BIG.indexOf(d.properties.ST_NM) == -1){
                                return '#cbcbcb'
                            }else if(d.properties.ST_NM == 'Telangana'){
                                return plotVarDef[plotVar.v].limit.l3.c;
                            }else if(d.properties.RANKING >= plotVarDef[plotVar.v].limit.l4.l && d.properties.RANKING <= plotVarDef[plotVar.v].limit.l4.r){
                                return plotVarDef[plotVar.v].limit.l4.c;
                            }else if(d.properties.RANKING >=plotVarDef[plotVar.v].limit.l3.l && d.properties.RANKING <=plotVarDef[plotVar.v].limit.l3.r){
                                return plotVarDef[plotVar.v].limit.l3.c;
                            }else if(d.properties.RANKING >=plotVarDef[plotVar.v].limit.l2.l && d.properties.RANKING<=plotVarDef[plotVar.v].limit.l2.r){
                                return plotVarDef[plotVar.v].limit.l2.c;
                            }else if(d.properties.RANKING >= plotVarDef[plotVar.v].limit.l1.l ){
                                return plotVarDef[plotVar.v].limit.l1.c;
                            }else{
                                return '#000'
                            }
                         })

                    })

                    $("#legHead").show()
                    d3.select("#d1").text("1st - 5th");
                    d3.select("#d2").text("6th - 10th");
                    d3.select("#d3").text("11th - 15th");
                    d3.select("#d4").text("16th - 21st");
                    $("#index_data").append(data)
                    $("#table-area").show();
                }

                function makeTableSMALL(stateAPIData){
                    console.log(stateAPIData)
                    var data = "";

                    stateAPIData.forEach(function(d){

                        if(d.TYPE == 'small'){
                            data += '<tr id="'+ StateCodeObject[d.stateName] +'_col" onclick="highlight()" style="font-size:10px;"><td class="col-xs-4">'+ d.stateName +'</td><td class="col-xs-2" style="text-align:right">'+parseFloat(d.HQNI).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right">'+parseFloat(d.HQLI).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right">'+parseFloat(d.HII).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right;">'+d.RANKING+'</td></tr>'
                        }

                    })
                    
                    outlineMap.style('fill',function(d,i){
                        if(d == undefined ){
                            return '#cbcbcb'
                        }else if(SMALL.indexOf(d.properties.ST_NM) == -1){
                            return '#cbcbcb'
                        }else if(d.properties.RANKING >= plotVarDef['SMALL_STATE'].limit.l4.l && d.properties.RANKING <= plotVarDef['SMALL_STATE'].limit.l4.r){
                            return plotVarDef['SMALL_STATE'].limit.l4.c;
                        }else if(d.properties.RANKING >=plotVarDef['SMALL_STATE'].limit.l3.l && d.properties.RANKING <=plotVarDef['SMALL_STATE'].limit.l3.r){
                            return plotVarDef['SMALL_STATE'].limit.l3.c;
                        }else if(d.properties.RANKING >=plotVarDef['SMALL_STATE'].limit.l2.l && d.properties.RANKING<=plotVarDef['SMALL_STATE'].limit.l2.r){
                            return plotVarDef['SMALL_STATE'].limit.l2.c;
                        }else if(d.properties.RANKING >= plotVarDef['SMALL_STATE'].limit.l1.l ){
                            return plotVarDef['SMALL_STATE'].limit.l1.c;
                        }else{
                            return '#000'
                        }
                     })

                    $("#legHead").show()
                    d3.select("#d1").text("1st - 2nd");
                    d3.select("#d2").text("3rd - 4th");
                    d3.select("#d3").text("5th - 7th");
                    d3.select("#d4").text("8th - 9th");
                    $("#index_data").append(data)
                    $("#table-area").show();
                }

                function makeTableUT(stateAPIData){
                    console.log(stateAPIData)
                    var data = "";

                    stateAPIData.forEach(function(d){

                        if(d.TYPE == 'UT'){
                            data += '<tr id="'+ StateCodeObject[d.stateName] +'_col" onclick="highlight()" style="font-size:10px;"><td class="col-xs-4">'+ d.stateName +'</td><td class="col-xs-2" style="text-align:right">'+parseFloat(d.HQNI).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right">'+parseFloat(d.HQLI).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right">'+parseFloat(d.HII).toFixed(2)+'</td><td class=" col-xs-2" style="text-align:right;">'+d.RANKING+'</td></tr>'
                        }

                    })
                    
                    outlineMap.style('fill',function(d,i){
                        if(d == undefined ){
                            return '#cbcbcb'
                        }else if(UT.indexOf(d.properties.ST_NM) == -1){
                            return '#cbcbcb'
                        }else if(d.properties.RANKING >= plotVarDef['UT_STATE'].limit.l4.l && d.properties.RANKING <= plotVarDef['UT_STATE'].limit.l4.r){
                            return plotVarDef['UT_STATE'].limit.l4.c;
                        }else if(d.properties.RANKING >=plotVarDef['UT_STATE'].limit.l3.l && d.properties.RANKING <=plotVarDef['UT_STATE'].limit.l3.r){
                            return plotVarDef['UT_STATE'].limit.l3.c;
                        }else if(d.properties.RANKING >=plotVarDef['UT_STATE'].limit.l2.l && d.properties.RANKING<=plotVarDef['UT_STATE'].limit.l2.r){
                            return plotVarDef['UT_STATE'].limit.l2.c;
                        }else if(d.properties.RANKING >= plotVarDef['UT_STATE'].limit.l1.l ){
                            return plotVarDef['UT_STATE'].limit.l1.c;
                        }else{
                            return '#000'
                        }
                     })
                    $("#legHead").show()
                    d3.select("#d1").text("1st");
                    d3.select("#d2").text("2nd - 3rd");
                    d3.select("#d3").text("4th - 5th");
                    d3.select("#d4").text("6th");
                    $("#table-area").show();
                    $("#index_data").append(data)
                }
                
                var last_color=null, last_col_sel = null;

            if(index_plot == 'INFRA_INDEX'){

               
                $("#comming_soon").hide();
                $("#main-head").text("Health Infrastructure Index : INDIA")
                console.log("Health Index plotting ")
                makeTableBIG(stateAPIData);
                
                
                
                $("#legends").show()
                d3.select("#l1").text(plotVarDef[plotVar.v].limit.l1.head);
                d3.select("#l2").text(plotVarDef[plotVar.v].limit.l2.head);
                d3.select("#l3").text(plotVarDef[plotVar.v].limit.l3.head);
                d3.select("#l4").text(plotVarDef[plotVar.v].limit.l4.head);


            }else if(index_plot == 'MET_INDEX'){

                $("#legends").hide();
                $("#legHead").hide();
                $("#table-area").hide();

                outlineMap.style('fill','#74A9CF')
                $("#main-head").text("Maternal Health Index : INDIA")
                $("#comming_soon").show();

            }else if(index_plot == 'CHILD_CARE_INDEX'){

                $("#legends").hide();
                $("#legHead").hide();
                $("#table-area").hide();

                outlineMap.style('fill','#74A9CF')
                $("#main-head").text("Child Health Index : INDIA")
                $("#comming_soon").show();

            }else if(index_plot == 'COMM_DIS_INDEX'){

                MainHeading.text("Communicable Disease Index")
                $("#legends").hide();
                $("#legHead").hide();
                $("#table-area").hide();


                outlineMap.style('fill','#74A9CF')

                $("#main-head").text("Communicable Diseases Index : INDIA")
                $("#comming_soon").show();

            }else if(index_plot == 'NON_COMM_DIS_INDEX'){

                $("#legends").hide();
                $("#legHead").hide();
                $("#table-area").hide();

                outlineMap.style('fill','#74A9CF')
                $("#main-head").text("Non Communicable Diseases Index : INDIA")
                $("#comming_soon").show();

            }else if(index_plot == 'GEN_INDEX'){

                $("#legends").hide();
                $("#legHead").hide();
                $("#table-area").hide();


                outlineMap.style('fill','#74A9CF')
                $("#main-head").text("General Health Index : INDIA")
                $("#comming_soon").show();
             }

            stateNameData = g.append("g")
                        .selectAll("text")
                        .data(topojson.feature(STATEDistrictTopo, STATEDistrictTopo.objects.Admin2).features)
                        .enter()
                        .append("text")
                        .attr("d", pathState)
                        .attr("class", "statesNames")
                        .text(function(d){
                            if(d != undefined)
                                {
                                    return d.properties.ST_NM;
                                }
                         })
                       .attr("transform", function(d) { 
                            var centroid = pathState.centroid(d);
                            if(d.properties.ST_NM == 'Daman & Diu')
                            {
                                    return "translate(" + (centroid[0]-42) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'Punjab')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]-5) + ")"
                            }else if(d.properties.ST_NM == 'West Bengal')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Jammu & Kashmir')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]+10) + ")"
                            }else if(d.properties.ST_NM == 'Madhya Pradesh')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Maharashtra')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Karnataka')
                            {
                            return "translate(" + (centroid[0]-30) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Andhra Pradesh')
                            {
                            return "translate(" + (centroid[0]-35) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Kerala')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+15) + ")"
                            }else if(d.properties.ST_NM == 'Bihar')
                            {
                            return "translate(" + (centroid[0]-5) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Uttar Pradesh')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Jharkhand')
                            {
                            return "translate(" + (centroid[0]-17) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Arunanchal Pradesh')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Assam')
                            {
                            return "translate(" + (centroid[0]-40) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Meghalaya')
                            {
                            return "translate(" + (centroid[0]-25) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Nagaland')
                            {
                            return "translate(" + (centroid[0]+3) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Manipur')
                            {
                            return "translate(" + (centroid[0]) + "," + (centroid[1]+5) + ")"
                            }else if(d.properties.ST_NM == 'Tripura')
                            {
                            return "translate(" + (centroid[0]-20) + "," + (centroid[1]) + ")"
                            }else if(d.properties.ST_NM == 'Mizoram')
                            {
                            return "translate(" + (centroid[0]+2) + "," + (centroid[1]) + ")"
                            }
                            else if(d.properties.ST_NM == 'Chandigarh')
                            {
                            return "translate(" + (centroid[0]-15) + "," + (centroid[1]+7) + ")"
                            }
                            return "translate(" + (centroid[0]-15) + "," + centroid[1] + ")"
                        })
                        .attr("font-family", "helvetica")
                        .attr("font-size", (fontSize-3)+"px")
                        .attr("font-style", "bold")
                        .attr("fill", "black")
                        .on('click',function(d){
                            

                        })


                }
            
        function numberWithCommas(x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }  
    }       
  }
    function hideXtra(){
        InfoShortage.text("")
        InfoRequired.text("")
        InfoExisting.text("")
        InfoShortageLabel.text("")
        InfoRequiredLabel.text("")
        InfoExistingLabel.text("")
        for(var i=0;i<10;i++){
            $("#LABEL_"+(i+1)).hide();
            $("#VALUE_"+(i+1)).hide();
        }
    }
}