import Faculty from "../../src/models/faculty.model.js";
import Student from "../../src/models/student.model.js";
import { asyncHandler } from "../../src/utils/asyncHandler.js";


export const preAllotFaculty = asyncHandler(async () => {
    const nrjtyg_id = '680c7420fea46219d823d05b';
    const nrjtyg = await Faculty.findById(nrjtyg_id).select("student");
    const shsnkptl_id = '680cce45196ffd814be8896a'
    const shsnkptl = await Student.findById(shsnkptl_id).select("supervisor");
    shsnkptl.supervisor.push(nrjtyg_id);
    await shsnkptl.save();
    nrjtyg.student.push(shsnkptl_id);
    await nrjtyg.save();
    const amtbsws_id = '680c7423fea46219d823d085';
    const amtbsws = await Faculty.findById(amtbsws_id).select("student");
    const shvmsng_id = '680cce40196ffd814be8892e';
    const shvmsng = await Student.findById(shvmsng_id).select("supervisor");
    shvmsng.supervisor.push(amtbsws_id);
    await shvmsng.save();
    amtbsws.student.push(shvmsng_id);
    await amtbsws.save();
    const klswklr_id = '680c7423fea46219d823d081';
    const klswklr = await Faculty.findById(klswklr_id).select("student");
    const trngjrl_id = '680cce44196ffd814be88960';
    const trngjrl = await Student.findById(trngjrl_id).select("supervisor");
    trngjrl.supervisor.push(klswklr_id);
    await trngjrl.save();
    klswklr.student.push(trngjrl_id);
    await klswklr.save();
    const dshysng_id = '680c7421fea46219d823d06f';
    const dshysng = await Faculty.findById(dshysng_id).select("student");
    const abngsn_id = '680cce45196ffd814be88976';
    const abngsn = await Student.findById(abngsn_id).select("supervisor");
    abngsn.supervisor.push(dshysng_id);
    await abngsn.save();
    dshysng.student.push(abngsn_id);
    await dshysng.save();
})