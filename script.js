
(() => {
  const ACCESS_CODE = "031026";
  const stages = [...document.querySelectorAll(".stage")];
  const screens = [...document.querySelectorAll(".screen")];

  const showStage = id => {
    stages.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const showScreen = id => {
    screens.forEach(s => s.classList.toggle("active", s.id === id));
    window.scrollTo({top:0,behavior:"smooth"});
  };
  const setFeedback = (el,msg,good=false) => {
    el.textContent = msg;
    el.className = "feedback " + (good ? "good":"bad");
  };

  document.getElementById("envelopeBtn").addEventListener("click",()=>showStage("passwordStage"));

  document.getElementById("passwordForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const input = document.getElementById("passwordInput");
    const fb = document.getElementById("passwordFeedback");
    if(input.value.trim() === ACCESS_CODE){
      setFeedback(fb,"ACCESS GRANTED.",true);
      setTimeout(()=>showStage("calibrationStage"),650);
    } else {
      setFeedback(fb,"ACCESS DENIED. Check the date.");
      input.select();
    }
  });

  document.getElementById("beginArchiveBtn").addEventListener("click",()=>showStage("archiveStage"));
  document.getElementById("startReconstructionBtn").addEventListener("click",()=>showScreen("reconstruction"));

  document.getElementById("checkReconstructionBtn").addEventListener("click",()=>{
    const selects = [...document.querySelectorAll(".record select")];
    const fb = document.getElementById("reconstructionFeedback");
    const unfilled = selects.some(s=>!s.value);
    if(unfilled){
      setFeedback(fb,"All four records must be assigned before the archive can be checked.");
      return;
    }
    const wrong = selects.filter(s=>s.value !== s.dataset.correct);
    if(wrong.length === 0){
      setFeedback(fb,"ARCHIVE RECONSTRUCTED. Interpretation layer unlocked.",true);
      setTimeout(()=>showScreen("principle"),700);
    } else {
      setFeedback(fb,`${wrong.length} classification${wrong.length>1?"s are":" is"} inconsistent with the archive. Reassess the evidence.`);
    }
  });

  document.getElementById("principleForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const selected = e.currentTarget.querySelector('input[name="principle"]:checked');
    const fb = document.getElementById("principleFeedback");
    if(!selected){
      setFeedback(fb,"Select an interpretation before submitting.");
      return;
    }
    if(selected.value === "INTEGRATION"){
      setFeedback(fb,"PRINCIPLE IDENTIFIED: INTEGRATION.",true);
      setTimeout(()=>showScreen("keyStage"),700);
    } else {
      const hints = {
        REINVENTION:"The archive shows continuity, not total replacement.",
        DETACHMENT:"The previous versions remain part of the evidence.",
        ACCEPTANCE:"The archive includes deliberate change, not passive acceptance."
      };
      setFeedback(fb,hints[selected.value]);
    }
  });

  document.getElementById("finalForm").addEventListener("submit",(e)=>{
    e.preventDefault();
    const val = document.getElementById("finalInput").value.trim().toUpperCase();
    const fb = document.getElementById("finalFeedback");
    if(val === "BECOMING"){
      setFeedback(fb,"KEY RECOVERED.",true);
      setTimeout(()=>showScreen("result"),700);
    } else {
      setFeedback(fb,"Not yet. The process is continuous, unfinished, and forward-moving.");
    }
  });

  document.getElementById("closeBtn").addEventListener("click",()=>showScreen("closed"));
})();
