import { useState, useEffect, useRef } from "react";

const C={bg:"#07070e",panel:"#0d0d1a",border:"#181828",accent:"#e8ff00",blue:"#00c2ff",purple:"#b060ff",red:"#ff3a5c",orange:"#ff9500",green:"#00ffaa",teal:"#00e5cc",pink:"#ff6bcc",text:"#f0f0f0",muted:"#44445a",card:"#0f0f1c",cardH:"#131326"};

const GOALS=[{id:"handstand",label:"Handstand Push-up",emoji:"🤸",color:C.accent},{id:"flag",label:"Human Flag",emoji:"🚩",color:C.red},{id:"planche",label:"Planche",emoji:"⚖️",color:C.purple},{id:"muscleup",label:"Muscle-up",emoji:"💪",color:C.blue},{id:"frontlev",label:"Front Lever",emoji:"🏹",color:C.orange},{id:"backlev",label:"Back Lever",emoji:"🔄",color:C.green},{id:"pistol",label:"Pistol Squat",emoji:"🦵",color:C.pink},{id:"dragon",label:"Dragon Flag",emoji:"🐉",color:"#ff4400"}];

const PUSHUPS=[
  {name:"Pompes larges",target:"Pectoraux ext.",icon:"💪",cue:"Mains 2× largeur épaules. Descends 2s lent, remonte explosif. Coudes à 45°."},
  {name:"Pompes diamant",target:"Triceps + pec médian",icon:"💎",cue:"Index et pouces se touchent. Coudes collés au corps. Descends 3s, remonte rapide."},
  {name:"Pompes déclinées",target:"Haut pec + deltoïdes",icon:"📐",cue:"Pieds surélevés 60cm. Corps en ligne. Base directe du HSPU."},
  {name:"Pompes inclinées",target:"Bas pec + sérratus",icon:"📉",cue:"Mains sur marche basse. Le haut du corps descend. Stretch profond en bas."},
  {name:"Pompes archer",target:"Unilatéral",icon:"🏹",cue:"Un bras tend sur le côté pendant que l'autre fléchit. Progression vers pompe 1 bras."},
  {name:"Pike push-ups",target:"Épaules — HSPU prep",icon:"🔺",cue:"Hanches en l'air, corps en V. Plie les coudes → tête vers le sol. Garde le V."},
  {name:"Pompes explosives",target:"Puissance",icon:"⚡",cue:"Descends lent 2s, remonte EXPLOSIF. Décolle les mains. Force de vitesse."},
  {name:"Pompes une main (négatif)",target:"Force max unilatérale",icon:"☝️",cue:"Soulève une main. Descends en 5s. Remonte à 2 mains. Alterne chaque série."},
  {name:"Pseudo planche push-ups",target:"Planche prep",icon:"⚖️",cue:"Mains tournées vers les pieds. Pousse les épaules EN AVANT avant de descendre."},
  {name:"Pike push-ups déclinés",target:"HSPU avancé",icon:"🤸",cue:"Pieds surélevés + corps en V serré. Aussi difficile qu'un vrai HSPU."},
];

const SC=[
  {title:"Audit corporel",type:"observe",color:C.blue,xp:25,desc:"Dans chaque conversation, observe uniquement l'orientation du corps. Vers toi = intérêt. Ailleurs = fermeture. Corps = vérité.",action:"Note le soir 3 observations concrètes. Faits seulement — pas d'interprétation."},
  {title:"Silence 3 secondes",type:"silence",color:C.purple,xp:30,desc:"Après chaque phrase importante, compte 3 secondes avant de reprendre. Ne remplis pas le vide. Laisse ton message résonner.",action:"Applique ça 5 fois minimum aujourd'hui."},
  {title:"Question émotionnelle",type:"connect",color:C.green,xp:35,desc:"'C'est quoi ton projet qui t'excite là ?' — pas 'Tu fais quoi dans la vie ?' Les faits relient. Les émotions connectent.",action:"Une question, une vraie réponse. Écoute sans préparer ta réplique."},
  {title:"Auto-dérision calibrée",type:"humor",color:C.orange,xp:30,desc:"Moque-toi d'un défaut MINEUR avec fierté. Tu montres que tu n'as pas besoin de te protéger.",action:"'Je suis tellement [défaut mineur] que [conséquence absurde].' Souris."},
  {title:"Écho ×2",type:"connect",color:C.accent,xp:35,desc:"Répète les 3 derniers mots sous forme de question. Puis silence 2s. La personne parle 3× plus longtemps.",action:"Plus de 20 mots dans la réponse = tu as touché quelque chose de vrai."},
  {title:"Micro-expressions",type:"observe",color:C.blue,xp:30,desc:"0.2s de vrai ressenti avant le masque. Observe le visage au moment d'une annonce ou question directe.",action:"Mute une vidéo 5min. Lis uniquement les visages. Tu seras surpris."},
  {title:"Valeur dans le silence",type:"silence",color:C.purple,xp:30,desc:"Quand un blanc arrive, laisse-le 3s. Puis observation précise ou vraie question. Jamais du bruit vide.",action:"'Je remarque que [observation très précise]...' — ça montre que tu es là."},
  {title:"Callback en or",type:"humor",color:C.orange,xp:40,desc:"Mémorise un mot inhabituel dit en début de conv. Replace-le 15min plus tard dans un contexte différent.",action:"L'autre réalise que tu l'écoutais vraiment. La forme d'humour la plus puissante."},
  {title:"Réciprocité émotionnelle",type:"connect",color:C.green,xp:40,desc:"L'autre partage au niveau 5 → tu partages au niveau 4. Jamais plus profond que lui. Espace safe, sans pression.",action:"'Je comprends — moi aussi j'ai ce truc avec [2-3 phrases].' Puis silence."},
  {title:"Lecture des intérêts",type:"observe",color:C.blue,xp:35,desc:"Pose une question ouverte. Compte les mots. Moins de 10 = poli. Plus de 20 = intérêt réel.",action:"Adapte ton investissement selon le résultat. Ne force pas là où il n'y a rien."},
  {title:"Structure de blague",type:"humor",color:C.orange,xp:35,desc:"Setup → Tension → Twist inattendu. La surprise est la mécanique — pas le contenu.",action:"Prends une vérité banale. Donne-lui une fin absurde. Place-la au bon moment."},
  {title:"Silence dominant",type:"silence",color:C.purple,xp:35,desc:"Prends 2-3s avant chaque réponse. Tes mots ont de la valeur. Les leaders possèdent le silence.",action:"Parle 30% moins en groupe aujourd'hui. Observe qui te cherche du regard."},
  {title:"Présence physique",type:"observe",color:C.accent,xp:30,desc:"Ton corps parle avant toi. Orientation, bras ouverts, contact visuel. Corrige en temps réel.",action:"Ton corps entraîné = confiance sociale visible sans un seul mot."},
  {title:"Style d'attachement",type:"observe",color:C.blue,xp:40,desc:"Anxieux = cherche validation. Évitant = répond court. Secure = contact visuel stable, questions réelles.",action:"Chaleur avec l'anxieux. Espace avec l'évitant. Profondeur directe avec le secure."},
  {title:"Écoute 70/30",type:"connect",color:C.green,xp:35,desc:"Max 30% de parole. De vraies questions, pas du silence gêné. L'autre se sent rare quand il parle.",action:"Ne parle que si tu ajoutes de la valeur ou poses une vraie question."},
  {title:"Fin mémorable",type:"connect",color:C.teal,xp:40,desc:"Coupe AVANT le pic d'ennui. Sur une note haute. Rire, intrigue, ou vérité sincère.",action:"'J'étais vraiment content de parler de ça avec toi.' Court. Sincère. Définitif."},
  {title:"To be continued",type:"humor",color:C.orange,xp:45,desc:"Arrête une bonne histoire au moment le plus fort. 'Je te raconterai la suite.' L'envie de te revoir est créée.",action:"L'efficacité dépend de la qualité de l'histoire. Ne la gâche pas sur du banal."},
  {title:"Silence confortable",type:"silence",color:C.purple,xp:45,desc:"Être bien ensemble sans parler 15 secondes. Test ultime de la qualité du lien.",action:"Si l'autre remplit immédiatement, c'est un signal sur son niveau d'anxiété."},
  {title:"Congruence totale",type:"observe",color:C.blue,xp:40,desc:"Mots et ton divergent → crois le ton. Ton et corps divergent → crois le corps.",action:"Note 2 moments aujourd'hui où corps et mots ne disaient pas la même chose."},
  {title:"Approche 60 secondes",type:"connect",color:C.green,xp:55,desc:"Un inconnu, une raison neutre, 60 secondes. L'objectif : rester sans anxiété. Le reste vient après.",action:"Commentaire sur l'environnement. Naturel. Pas une 'approche'."},
  {title:"Humour de timing",type:"humor",color:C.orange,xp:45,desc:"2 signaux verts sur 3 (énergie ok, personne ouverte, humour initié) → envoie. Sinon → retiens.",action:"Qualité > quantité. Une bonne vanne vaut mieux que cinq ratées."},
  {title:"Écho + silence combo",type:"silence",color:C.purple,xp:50,desc:"Écho (3 derniers mots en question) + silence 3s dans la même conv. Profondeur immédiate.",action:"Teste sur quelqu'un qui parle vite. L'effet de ralentissement est visible."},
  {title:"Conversation 10 minutes",type:"connect",color:C.green,xp:60,desc:"Quelqu'un que tu connais peu. 10 minutes. Uniquement des questions réelles. Aucun small talk.",action:"Chaque question naît de ce que l'autre vient de dire. Pas de liste préparée."},
  {title:"Auto-dérision ×2",type:"humor",color:C.orange,xp:50,desc:"2 auto-dérisions dans la même conv. La seconde plus précise et plus légère. Confiance massive.",action:"Si l'autre commence à faire de l'auto-dérision en retour → espace de sécurité créé."},
  {title:"Silence de groupe",type:"silence",color:C.purple,xp:55,desc:"30% moins de parole en groupe. Quand tu parles → quelque chose que personne n'aurait dit.",action:"Les gens qui parlent peu mais bien deviennent ceux dont l'opinion compte."},
  {title:"Corps après séance",type:"observe",color:C.accent,xp:45,desc:"Après ta séance cali, va quelque part. Observe ta posture, ton espace. Ton corps parle avant toi.",action:"Confiance physique = fondation de la confiance sociale. Une seule chose."},
  {title:"Commentaire environnement",type:"connect",color:C.green,xp:65,desc:"Observation partagée spontanée avec quelqu'un à côté de toi. Pas une approche — juste une vérité.",action:"Si l'autre sourit ou s'engage → tu viens de créer quelque chose à partir de rien."},
  {title:"Analyse post-conv",type:"observe",color:C.blue,xp:50,desc:"Après une conversation : mots ? corps ? divergence ? Qu'est-ce que ça révèle sur l'autre et sur toi ?",action:"5 lignes le soir. En 3 mois tu deviens expert en lecture humaine."},
  {title:"Silence après victoire",type:"silence",color:C.purple,xp:55,desc:"Après une bonne blague ou vérité — ne continue PAS. Laisse le moment exister. Ne l'explique pas.",action:"Se taire après un bon moment = charisme naturel perçu instantanément."},
  {title:"Connexion profonde en 5 échanges",type:"connect",color:C.green,xp:70,desc:"Du small talk à un sujet émotionnellement vrai en moins de 5 échanges. Profondeur = compétence.",action:"Question personnelle, aveu mineur, ou observation précise sur l'autre. Lance."},
];

const getPu=(m,w,s)=>PUSHUPS[(m*20+w*5+s)%PUSHUPS.length];
const getSC=(m,w,s)=>SC[(m*20+w*5+s)%SC.length];

/* ─── MONTHS ─────────────────────────────────────────────────────────────── */
const MONTHS=[
  {month:1,title:"Fondations Acier",emoji:"⚡",color:C.accent,focus:"Base structurelle — gainage, scapulaires, conscience corporelle",theory:"Avant les skills, ton corps a besoin d'une base solide : gainage actif, force scapulaire, mobilité des poignets. Sauter cette phase = blessures dans 3 mois.",
  weeks:[
    {w:1,theme:"Initialisation",sessions:[
      {day:"J1",label:"Push Fondation",exos:["Pompes 5×10 tempo 2-0-2","Dips parallèles 4×8","Pike push-ups 4×8","Gainage frontal 3×45s","Hollow body 3×25s","Shoulder taps 3×12"]},
      {day:"J2",label:"Pull Fondation",exos:["Tractions 4×5","Ring rows 4×10","Scapular pulls 3×12","Dead hang 3×35s","L-sit prise 3×10s","Chin-ups 3×6"]},
      {day:"J3",label:"Core & Jambes",exos:["Squats 4×15","Fentes marchées 3×12/j","Dragon flag négatif 3×4 (5s)","Hollow rock 3×15","Side plank 3×35s","Reverse plank 3×30s"]},
      {day:"J4",label:"HS Intro",exos:["Handstand mur 5×25s","Frog stand 4×25s","Wrist circles 3×20","Pike déclinés 4×8","Balance drills 5min","Kick-up 10×"]},
      {day:"J5",label:"Full Body Circuit",exos:["Pompes 3×15","Tractions 3×6","Dips 3×10","Squats sautés 3×12","Burpees 3×10","Core finisher 3 rounds"]},
    ]},
    {w:2,theme:"Construction",sessions:[
      {day:"J1",label:"Push Volume",exos:["Pompes lestées 5×8","Dips lestés 4×8","Pike 5×10","Gainage 3×55s","Hollow body 3×30s","Isométrie basse 3×10s"]},
      {day:"J2",label:"Pull Volume",exos:["Tractions 5×6","L-sit 4×15s","Ring rows lestés 4×8","Archer rows 3×6","Dead hang 2×45s","Scapular dips 3×10"]},
      {day:"J3",label:"Core Profond",exos:["Dragon flag négatif 4×5","Hollow body 4×30s","Ab wheel 3×8","Side plank lestée 3×40s","L-sit barre 3×18s","Windshield wipers 3×8"]},
      {day:"J4",label:"HS & Équilibre",exos:["HS mur 6×30s","Frog stand 4×30s","Wrist conditioning 5min","Balance kick-up 15×","Shoulder press 4×10","Pike déclinés 4×10"]},
      {day:"J5",label:"Cardio-Force",exos:["Pompes 3×15+Tractions 3×8","Dips 3×12+Squats sautés 3×15","Burpees 3×12","Mountain climbers 3×25","Core 4 rounds","Stretch 10min"]},
    ]},
    {w:3,theme:"Intensification",sessions:[
      {day:"J1",label:"Push Intensité",exos:["Pompes 6×12","Dips 5×10","Pompes déclinées 4×10","Isométrie basse 4×8s","Hollow body 4×30s","Shoulder circuit 3rds"]},
      {day:"J2",label:"Pull Intensité",exos:["Tractions lestées 4×6","L-sit 4×22s","Ring rows 5×8","Archer rows 3×8","Dead hang lestés 2×40s","Back lever prise 3×5s"]},
      {day:"J3",label:"Jambes & Dragon",exos:["Pistol squat 4×5/j","Romanian DL 4×10","Dragon flag négatif 4×6","Ab wheel 4×10","Hollow rock 4×18","Tuck planche 3×10s"]},
      {day:"J4",label:"HSPU Intro",exos:["HSPU négatif 4×5 (5s)","HS 10min total","Pike lestés 4×10","Kick-up 15×","Wrist rehab 5min","Frog stand 4×30s"]},
      {day:"J5",label:"Test S3",exos:["Max pompes (noté)","Max tractions (noté)","L-sit max (noté)","HS max durée (noté)","Dragon flag max (noté)","Gainage max (noté)"]},
    ]},
    {w:4,theme:"Décharge",sessions:[
      {day:"J1",label:"Décharge Upper",exos:["Pompes 3×10 léger","Tractions 3×5","Dips 3×8","Stretching épaules 15min"]},
      {day:"J2",label:"Décharge Core",exos:["Gainage 3×30s","Hollow body 3×20s","Stretching complet 20min","Respiration 10min"]},
      {day:"J3",label:"Mobilité Active",exos:["Yoga flow 25min","Wrist & shoulder 10min","Hip flexors stretch","Thoracic spine mobility"]},
      {day:"J4",label:"Technique Pure",exos:["HS technique mur 15min","L-sit 3×15s","Frog stand 3×30s","Balance drills 10min"]},
      {day:"J5",label:"Bilan M1",exos:["Marche 35min","Foam rolling complet","Écrire tous ses PRs","Comparer S1 vs S3"]},
    ]},
  ]},
  {month:2,title:"Force Spécifique",emoji:"🔥",color:C.red,focus:"Force ciblée sur chaque skill — première acquisition",theory:"La force spécifique s'entraîne dans la position exacte du mouvement. Le corps ne transfère pas automatiquement. Tu dois construire la force là où tu en as besoin.",
  weeks:[
    {w:1,theme:"Skill Intro",sessions:[
      {day:"J1",label:"HSPU Prog",exos:["HSPU négatif 5×5 (5s)","Pike déclinés 5×10","Dips lestés 4×10","HS mur 6×30s","Shoulder press 4×8","Pseudo planche 4×8s"]},
      {day:"J2",label:"Back & Front Lever",exos:["BL prise 4×8s","FL prise 4×6s","Tractions lestées 5×5","L-sit straddle 4×20s","Ring rows lestés 4×8","Dead hang lestés 2×40s"]},
      {day:"J3",label:"Planche & Core",exos:["Planche lean 4×8s","Pseudo planche 4×8","Dragon flag 4×6","Hollow body 5×30s","Ab wheel 4×10","Tuck planche 3×12s"]},
      {day:"J4",label:"Human Flag Intro",exos:["Flag prise 4×6s","Side lever 4×10s","Dragon flag négatif 4×6","Obliques lestés 4×12","Windshield wipers 3×10","Core lat 3×25s"]},
      {day:"J5",label:"Muscle-up Intro",exos:["MU négatif 4×4","Bar dips 4×10","Kipping 8min","Tractions explosives 4×6","Ring support 3×25s","Transition drill 3×6"]},
    ]},
    {w:2,theme:"Consolidation",sessions:[
      {day:"J1",label:"HSPU Volume",exos:["HSPU 5×5","Pompes une main négatif 3×5","HS libre 12min","Pseudo 4×10","Wrist conditioning 5min","Pike explosive 3×8"]},
      {day:"J2",label:"FL Progression",exos:["FL tuck 4×12s","Tractions lestées 5×6","L-sit→tuck 4×6","Ring rows 4×10","Scapular depression 3×12","One arm dead hang 3×10s"]},
      {day:"J3",label:"Planche & Dragon",exos:["Planche lean+ext 5×8s","Dragon flag 4×7","Pseudo 4×10","Hollow body 5×32s","Ab wheel 4×10","Core isomét 4×20s"]},
      {day:"J4",label:"Flag Progression",exos:["Flag 4×10s","Side plank lestée 4×35s","Dragon flag 4×7","Obliques 4×12","Tuck flag 3×12s","Lat push-downs 3×12"]},
      {day:"J5",label:"MU Construction",exos:["MU 3×3","Tractions 5×8","Bar dips 4×12","Ring MU transition 3×5","Kip controlled 5min","Full upper finisher"]},
    ]},
    {w:3,theme:"Intensification",sessions:[
      {day:"J1",label:"HSPU Peak Vol",exos:["HSPU 5×6","Pompes 6×12","Dips lestés 5×10","HS 14min total","Pike explosive 3×10","Shoulder circuit 3rds"]},
      {day:"J2",label:"FL + BL Peak",exos:["FL tuck 4×15s","BL 4×12s","Tractions lestées 5×7","L-sit 5×25s","Row uni 4×8","Dead hang lestés 2×35s"]},
      {day:"J3",label:"Planche Peak",exos:["Planche straddle 4×8s","Dragon flag 5×8","Pseudo explosive 5×8","Tuck planche 4×15s","Core max 3rds","Ab wheel 4×12"]},
      {day:"J4",label:"Flag Peak",exos:["Flag 4×12s","Side lever 4×12s","Dragon flag 5×8","Obliques 4×15","Windshield 4×12","Torsion lourde 3×12"]},
      {day:"J5",label:"Test M2",exos:["HSPU max","MU max","Flag max","FL hold max","Planche hold max","Bilan noté"]},
    ]},
    {w:4,theme:"Décharge",sessions:[
      {day:"J1",label:"Décharge Push",exos:["Pompes 3×10","Dips 3×8","Stretching épaules"]},
      {day:"J2",label:"Décharge Pull",exos:["Tractions 3×5","Dead hang 3×35s","Stretching dos"]},
      {day:"J3",label:"Mobilité",exos:["Yoga 30min","Hip & shoulder","Wrist rehab"]},
      {day:"J4",label:"Technique",exos:["HS 18min technique","Planche drills 10min","Flag entries 10min"]},
      {day:"J5",label:"Bilan M2",exos:["Cardio 30min","Foam rolling","Bilan M1 vs M2","Plan M3"]},
    ]},
  ]},
  {month:3,title:"Monstres Naissants",emoji:"💀",color:C.purple,focus:"Skills qui tiennent — qualité, durée, premières combinaisons",theory:"Un skill tenu proprement demande 3 choses : force brute, stabilité neuromusculaire, endurance spécifique. Ce mois tu combines les 3.",
  weeks:[
    {w:1,theme:"Skills Holding",sessions:[
      {day:"J1",label:"HSPU Complet",exos:["HSPU 5×5 complets","Pompes une main 4×4","Pseudo planche 5×10","HS walk 8min","HS tenu 30s×3","Shoulder circuit 3rds"]},
      {day:"J2",label:"FL Tenu",exos:["FL tuck 4×18s","FL row 4×8","Tractions lestées 5×6","L-sit 5×28s","Ring row explosif 3×8","One arm négative 3×8s"]},
      {day:"J3",label:"Flag + Planche",exos:["Planche straddle 4×10s","Flag 4×14s","Dragon flag 4×8","Core circuit max","Windshield 4×12","Tuck planche 4×15s"]},
      {day:"J4",label:"MU Volume",exos:["MU 4×4","Bar dips lestés 4×10","Ring dips 4×8","Tractions explosives 4×6","Ring support 3×25s","MU slow negative 3×4"]},
      {day:"J5",label:"Full Skills",exos:["HS 18min","Flag 5×14s","FL 4×18s","Planche 4×10s","MU 3×4","Core finisher 10min"]},
    ]},
    {w:2,theme:"Progression",sessions:[
      {day:"J1",label:"HSPU + Walk",exos:["HSPU 5×6","HS walk 12min","Pompes archer 4×6","Pike press 90° 4×8","HS mur 4×40s","Shoulder finisher"]},
      {day:"J2",label:"FL Full",exos:["FL full 3×8s","FL tuck 4×20s","Tractions 5×7 lestées","L-sit→V-sit 4×5","Ring rows 4×10","Scapular isomét 3×18s"]},
      {day:"J3",label:"Flag Max",exos:["Flag 4×18s","Dragon flag 5×10","Side lever 4×14s","Obliques torsion 4×15","Hollow rock 4×22","Tuck planche 5×12s"]},
      {day:"J4",label:"Planche Avancée",exos:["Planche full 4×10s","Pseudo 5×12","Planche push-up négatif 3×4","Core planche 5×25s","Wrist conditioning","Elbow lever intro 3×15s"]},
      {day:"J5",label:"MU Power",exos:["MU explosif 4×5","Ring MU 3×3","Bar dips lestés 4×12","360° bar intro 3×4","Full upper 3rds","Core finisher"]},
    ]},
    {w:3,theme:"Peak M3",sessions:[
      {day:"J1",label:"Intensity Push",exos:["HSPU 6×5","Pompes une main 4×5","HS 20min","Pseudo 5×12","Press HS négatif 3×4","Finisher épaules"]},
      {day:"J2",label:"Intensity Pull",exos:["FL 4×14s","BL 4×14s","Tractions 5×8 lestées","L-sit 5×32s","Row uni 4×8","Scapular 3×15"]},
      {day:"J3",label:"Flag Core Peak",exos:["Flag 4×20s","Dragon flag 5×12","Tuck planche 5×14s","Windshield lestés 4×12","Ab wheel 4×12","Core isomét max"]},
      {day:"J4",label:"Planche Peak",exos:["Planche full 4×14s","Planche push-up 3×5","Pseudo explosive 4×10","Core planche max","Wrist rehab","Elbow lever 3×20s"]},
      {day:"J5",label:"Test M3",exos:["HSPU max","Flag max","FL max","Planche max","MU max","Bilan + vidéo"]},
    ]},
    {w:4,theme:"Décharge",sessions:[
      {day:"J1",label:"Décharge Push",exos:["Pompes 3×10","Dips 3×8","Wrist mobility"]},
      {day:"J2",label:"Décharge Pull",exos:["Tractions 3×6","Rows 3×8","Stretching dos"]},
      {day:"J3",label:"Mobilité",exos:["Yoga 32min","Foam rolling complet","Respiration"]},
      {day:"J4",label:"Technique Pure",exos:["HS 22min forme","Planche 15min drills","Flag entries 12min"]},
      {day:"J5",label:"Bilan M3",exos:["Natation ou vélo 40min","Bilan M3","Compare M1-M2-M3","Ajustements M4"]},
    ]},
  ]},
  {month:4,title:"Niveau Élite",emoji:"🏆",color:C.orange,focus:"Consolider — tenir proprement, combiner les skills",theory:"L'élite se joue dans la qualité : forme parfaite, tenue longue, transitions fluides. Ce mois tu consolides et tu commences les enchaînements.",
  weeks:[
    {w:1,theme:"Quality Focus",sessions:[
      {day:"J1",label:"HSPU Solide",exos:["HSPU 5×8","HS walk 18min","Pompes une main 4×6","Press HS négatif 4×5","Shoulder press lourd 4×6","Rotator cuff renfo"]},
      {day:"J2",label:"FL Complet",exos:["FL 4×18s","FL row 4×10","L-sit→V-sit 5×6","Tractions super lestées 4×5","BL 4×18s","Hollow 4×45s"]},
      {day:"J3",label:"Flag Propre",exos:["Flag 4×22s","Side lever 4×18s","Dragon flag 5×12","Windshield 4×15","Flag transitions 3×6","Torsion explosive 3×12"]},
      {day:"J4",label:"Planche Tenue",exos:["Planche 4×18s","Planche push-up 4×5","Pseudo 5×14","Core planche 5×35s","Wrist rehab 12min","Elbow lever 3×25s"]},
      {day:"J5",label:"MU + Combo",exos:["MU 5×6","Ring MU 3×5","Bar dips lestés 4×14","360° bar 3×5","Skills combo 3rds","Core finisher"]},
    ]},
    {w:2,theme:"Combinations",sessions:[
      {day:"J1",label:"HSPU + HS Marche",exos:["HSPU 5×10","HS marche 25min","Press to HS 3×5","Pompes archer 4×8","HS pirouette intro 3×3","Finisher épaules"]},
      {day:"J2",label:"FL Row Lestées",exos:["FL 4×22s","FL row lestées 4×8","Tractions 5×8 lestées","L-sit 5×38s","BL 4×22s","Scapular max"]},
      {day:"J3",label:"Flag Dynamo",exos:["Flag transfert 4×6","Dragon flag 5×14","360° bar swings 3×6","Torsion 4×15","Side lever max","Obliques max"]},
      {day:"J4",label:"Planche + Push",exos:["Planche 5×18s","Planche push-up 4×6","HSPU 3×8","Pseudo 5×14","Elbow lever 3×28s","Core max"]},
      {day:"J5",label:"Test M4",exos:["HSPU max reps","HS durée max","Flag max","Planche max","FL max","Vidéo obligatoire"]},
    ]},
    {w:3,theme:"Peak M4",sessions:[
      {day:"J1",label:"Peak Push",exos:["HSPU 6×8","Press HS 4×5","Pompes une main 4×7","HS 25min","Pirouette 3×4","Finisher max"]},
      {day:"J2",label:"Peak Pull",exos:["FL 5×20s","Tractions 5×8 lestées","V-sit 5×28s","BL 4×24s","Ring max","Scapular circuit"]},
      {day:"J3",label:"Peak Flag",exos:["Flag 5×24s","Dragon flag 5×14","360° bar 5×6","Obliques max","Torsion lourde","Core max"]},
      {day:"J4",label:"Peak Planche",exos:["Planche 5×22s","Planche push-up 4×6","Pseudo 5×16","Core planche max","Elbow lever max","Wrist rehab"]},
      {day:"J5",label:"Skills Complètes",exos:["HSPU→HS→descent 4×3","Flag→BL 4×5","MU→L-sit 4×4","FL pull 4×8","Planche combo 3×3","Core finisher"]},
    ]},
    {w:4,theme:"Décharge",sessions:[
      {day:"J1",label:"Décharge Push",exos:["Pompes 3×10","HSPU 2×6","Stretching"]},
      {day:"J2",label:"Décharge Pull",exos:["Tractions 3×6","Dead hang 3×35s","Stretching"]},
      {day:"J3",label:"Mobilité Profonde",exos:["Yoga 35min","Shoulder & hip deep"]},
      {day:"J4",label:"Technique",exos:["Chaque skill ×12min — forme parfaite, zéro volume"]},
      {day:"J5",label:"Bilan M4",exos:["Cardio 30min","Bilan M4","Plan M5"]},
    ]},
  ]},
  {month:5,title:"Maîtrise Absolue",emoji:"👑",color:C.blue,focus:"Enchaînements, puissance explosive, variantes avancées",theory:"La maîtrise se prouve dans les transitions. Un skill maîtrisé se fait proprement même fatigué, même devant des gens, même dans un enchaînement.",
  weeks:[
    {w:1,theme:"Explosive Power",sessions:[
      {day:"J1",label:"HSPU Explosif",exos:["HSPU clap 4×5","Press HS strict 4×6","Pompes une main 5×5","HS libre 28min","Pirouette 3×4","Épaule explosive finisher"]},
      {day:"J2",label:"FL Dynamique",exos:["FL raise 4×8","FL row max 4×8","Tractions 5×8 lestées","V-sit 4×25s","BL dynamique 3×5","Ring row explosif 4×8"]},
      {day:"J3",label:"Flag Dynamique",exos:["Flag dynamo 4×6","Dragon flag 5×14","360° swings 4×7","Windshield lestés 4×12","Torsion explosive 4×12","Obliques max"]},
      {day:"J4",label:"Planche Push-up",exos:["Planche push-up 4×5","Planche 5×24s","Pseudo explosive 4×10","Core isomét 5×45s","Wrist power 3×22","Elbow→planche 3×5"]},
      {day:"J5",label:"MU Circulaire",exos:["MU circulaire 4×5","Ring MU 3×5","360° bar 4×6","Bar dips lestés 5×12","BL dynamique 3×6","Full pull circuit max"]},
    ]},
    {w:2,theme:"Advanced Variants",sessions:[
      {day:"J1",label:"HS 360",exos:["HS pirouette 4×4","HSPU 5×8","Press HS 4×6","Pompes une main 5×6","HS walk 30min","Épaules max effort"]},
      {day:"J2",label:"BL Avancé",exos:["BL 4×24s","BL row 4×8","FL 4×24s","Tractions 5×8","L-sit max","One arm FL prise 3×5s"]},
      {day:"J3",label:"Flag Transfert",exos:["Flag→BL transitions 4×6","Dragon flag 5×16","Flag 5×26s","Obliques finisher max","Core torsion max","Windshield lestés max"]},
      {day:"J4",label:"Elbow Lever + Planche",exos:["Elbow lever 4×25s","Planche 5×24s","Planche push-up 4×6","Core max","Balance transitions 12min","Wrist conditioning"]},
      {day:"J5",label:"MU Power Max",exos:["MU explosif 4×6","Ring MU 4×5","Dips anneau 4×12","360° bar 4×6","Pull circuit max","Core finisher"]},
    ]},
    {w:3,theme:"Full Chains",sessions:[
      {day:"J1",label:"Chaîne HSPU→HS",exos:["HSPU→HS→descent 4×4","Press HS 4×6","Pompes archer 5×8","HS walk 35min","Pirouette 4×4","Finisher épaules"]},
      {day:"J2",label:"Chaîne FL→BL",exos:["FL→BL 4×5","Tractions 5×8","L-sit→V-sit 5×6","Ring rows 4×10","One arm FL prise 3×6s","Scapular circuit max"]},
      {day:"J3",label:"Chaîne Flag→Dragon",exos:["Flag→Dragon 4×6","360° bar 4×7","Windshield 4×16","Obliques max","Core circuit max","Torsion lourde"]},
      {day:"J4",label:"Chaîne Planche",exos:["Planche→push→planche 3×4","Planche 5×26s","Pseudo explosive 5×10","Core max","Wrist rehab","Elbow lever max"]},
      {day:"J5",label:"Test M5 + Vidéo",exos:["Chaque skill tenu au max","Enchaînement complet filmé","Tous les PRs notés","Plan M6"]},
    ]},
    {w:4,theme:"Décharge",sessions:[
      {day:"J1",label:"Décharge Active",exos:["Pompes 3×10","HSPU 2×6","Tractions 3×6","Mobilité"]},
      {day:"J2",label:"Mobilité Totale",exos:["Yoga 38min","Shoulder, hip, wrist complet"]},
      {day:"J3",label:"Technique Pure",exos:["HS 22min","Planche 18min","Flag 18min — forme seulement"]},
      {day:"J4",label:"Récup Active",exos:["Vélo ou natation 45min","Foam rolling complet"]},
      {day:"J5",label:"Prépa Show",exos:["Chorégraphie 25min","Vidéo test chaque skill","Bilan M5 complet"]},
    ]},
  ]},
  {month:6,title:"Le Show Final",emoji:"🎯",color:C.red,focus:"Peak performance — tout tenir, tout enchaîner, tout filmer",theory:"Le peaking est une science. 3 semaines volume maximum puis réduction. Semaine 4 : activation légère. Corps au show avec toute la force et zéro fatigue.",
  weeks:[
    {w:1,theme:"Peak Volume",sessions:[
      {day:"J1",label:"Peak Push Total",exos:["HSPU 6×10","Press HS 5×6","Pompes une main 5×7","HS 35min","Pirouette 4×5","Épaule finisher max"]},
      {day:"J2",label:"Peak Pull Total",exos:["FL 5×26s","Tractions 5×8 super lestées","V-sit 5×30s","BL 4×26s","Ring max effort","One arm FL prise 3×8s"]},
      {day:"J3",label:"Peak Flag & Core",exos:["Flag 5×28s","Dragon flag 5×18","360° bar 5×7","Windshield lestés max","Core max effort","Torsion lourde max"]},
      {day:"J4",label:"Peak Planche",exos:["Planche 5×28s","Planche push-up 5×6","Pseudo explosive 5×12","Core planche 5×50s","Wrist conditioning","Elbow lever max"]},
      {day:"J5",label:"Enchaînement+",exos:["Skills combo 4 rounds","Chorégraphie 3min","Filmer chaque skill","Core finisher","Stretch complet"]},
    ]},
    {w:2,theme:"Records",sessions:[
      {day:"J1",label:"Records Push",exos:["HSPU max reps PRs","Press HS max","Pompes une main max","HS durée max chronométré"]},
      {day:"J2",label:"Records Pull",exos:["FL max chronométré","Tractions lestées max","BL max","V-sit max","One arm FL record"]},
      {day:"J3",label:"Records Flag",exos:["Flag max durée vidéo","Dragon flag max","360° bar max","Core max total","Bilan core"]},
      {day:"J4",label:"Records Planche",exos:["Planche max vidéo","Planche push-up max","Pseudo max reps","Elbow lever max"]},
      {day:"J5",label:"Performance Filmée",exos:["Full performance 3-4min filmée","Chaque skill en conditions show","Partage si tu veux 😈"]},
    ]},
    {w:3,theme:"Peaking",sessions:[
      {day:"J1",label:"Peaking Push",exos:["HSPU 4×6","Press HS 3×5","HS 28min technique","Finisher léger"]},
      {day:"J2",label:"Peaking Pull",exos:["FL 3×20s","Tractions 3×6","BL 3×20s","L-sit 3×28s"]},
      {day:"J3",label:"Peaking Flag",exos:["Flag 3×22s","Dragon flag 3×12","Core maintenance"]},
      {day:"J4",label:"Peaking Planche",exos:["Planche 3×22s","Planche push-up 3×5","Core maintenance"]},
      {day:"J5",label:"Répétition Générale",exos:["Enchaînement relaxed","Pas de max","Mentalisation show","Visualisation 15min"]},
    ]},
    {w:4,theme:"Show Week",sessions:[
      {day:"J1",label:"Activation",exos:["Pompes 2×10","Tractions 2×6","Mobilité 20min","Visualisation skills"]},
      {day:"J2",label:"Technique Finale",exos:["Chaque skill 5min relaxed","Focus mental","Zéro fatigue"]},
      {day:"J3",label:"Repos Actif",exos:["Marche 30min","Stretching doux","Visualisation performance"]},
      {day:"J4",label:"Repos Total",exos:["Repos complet obligatoire","Alimentation optimale","Sommeil 8h+ minimum","Hydratation max"]},
      {day:"J5",label:"🎬 JOUR DE SHOW",exos:["Performance complète filmée !","Tous tes skills au top","6 mois = CE MOMENT","Prouve. Célèbre. 🔥"]},
    ]},
  ]},
];

/* ─── SOCIAL MODULES ─────────────────────────────────────────────────────── */
const SOCIAL_MODULES=[
  {id:"s1",title:"Maîtriser le Vide",emoji:"🎭",color:C.accent,desc:"Le silence n'est pas un vide — c'est une arme de précision.",
  lessons:[
    {title:"La neurologie du silence",body:"Le cerveau interprète le silence selon l'énergie que tu y mets. Si tu es à l'aise, l'autre s'installe. Si tu paniques, l'autre ressent l'inconfort. Ce n'est pas la durée — c'est ta présence dans ce silence. 3s après une affirmation forte = résonance. 3s après une question = pression douce.",tip:"Cette semaine : après chaque phrase importante, compte 3s. Observe l'envie de combler. Résiste.",exercise:"En conversation, réponds à une question, puis attends. Laisse l'autre réagir avant de continuer. Fais ça 10 fois."},
    {title:"Remplir avec de la valeur",body:"Il y a deux réactions au blanc : le remplir avec du bruit (anxiété visible) ou le laisser exister puis le ponctuer avec quelque chose de précis. La seconde crée un impact 10× plus fort. Règle : si tu parles, ajoute quelque chose. Sinon, reste dans le silence.",tip:"Formule de relance : 'Je remarque que [observation très précise sur l'environnement]...' — montre que tu es présent, pas que tu cherches à meubler.",exercise:"En groupe : parle uniquement quand tu as quelque chose qui n'aurait pas été dit sans toi. Mesure à quel point on t'écoute davantage."},
    {title:"Le silence dominant",body:"Les personnes magnétiques ne remplissent pas les silences — elles les possèdent. Prendre 2-3s avant de répondre communique que tes mots ont de la valeur. Répondre immédiatement communique que tu as peur de perdre l'attention.",tip:"Pratique : réponds toujours 1-2s plus tard que ton instinct. Cette friction minime transforme la perception que les gens ont de toi.",exercise:"Pendant 3 jours : ralentis ton rythme de parole de 20%. Fais des pauses plus longues. Note si les gens t'écoutent différemment."},
    {title:"Silences confortables vs malaisants",body:"La différence n'est pas la durée — c'est la qualité de présence des deux personnes. Un silence confortable dit 'on est bien ensemble'. Ça ne s'invente pas : ça se construit par une vraie présence, une vraie écoute, et l'absence d'anxiété.",tip:"Test : dans ta prochaine conversation profonde, laisse un silence arriver naturellement. Observe si l'autre se détend ou s'agite. C'est un baromètre exact du lien.",exercise:"Assis avec quelqu'un que tu connais bien. Ne dis rien pendant 30 secondes. Inconfortable la première fois. Magique la troisième."},
    {title:"Silences stratégiques",body:"Le silence stratégique : interrompre au moment le plus fort. Si tu racontes une histoire, arrête-toi à l'apex. Laisse 3-4s. L'autre veut la suite. C'est le secret des meilleurs conteurs, comédiens, négociateurs.",tip:"Au milieu d'une bonne histoire : arrête-toi, bois une gorgée, regarde l'autre. Reprends seulement quand il/elle penche légèrement vers toi.",exercise:"Raconte une histoire. Planifie 2 silences intentionnels : un au setup, un juste avant la chute. Observe l'effet."},
  ]},
  {id:"s2",title:"Le Timing Parfait",emoji:"⚡",color:C.blue,desc:"L'humour n'est pas ce que tu dis — c'est quand et comment.",
  lessons:[
    {title:"La mécanique du rire",body:"Le rire est une récompense neurologique pour une surprise bienveillante. Setup (attente créée) → Tension (pause ou montée) → Twist (rupture inattendue). Le contenu importe peu — la structure fait tout. N'importe quelle vérité banale, restructurée correctement, fait rire.",tip:"Observe les prochaines fois où tu ris. Identifie le setup, la tension, le twist. Tu commences à voir la mécanique derrière.",exercise:"Prends une vérité banale de ta journée. Écris 3 fins absurdes possibles. Celle qui casse le plus les attentes est la meilleure."},
    {title:"Lire la salle avec précision",body:"3 signaux avant de placer quoi que ce soit : 1. Niveau d'énergie (salle basse = pas de rire). 2. Ouverture de la personne (sourires, humour initié = vert). 3. Sujet actif (quelqu'un qui vient de partager quelque chose d'émotionnel n'est pas disponible pour l'humour). 2 signaux verts sur 3 = envoie.",tip:"Signal d'or : la personne en face fait elle-même de l'humour. C'est une invitation explicite. Réponds directement.",exercise:"Cette semaine : avant chaque tentative d'humour, verbalise mentalement les 3 signaux. Note combien de fois tu te retiens — et si c'était la bonne décision."},
    {title:"L'auto-dérision comme outil",body:"L'auto-dérision communique une chose rare : 'Je n'ai pas besoin de me protéger de toi.' C'est du courage social habillé en légèreté. Ligne à ne pas franchir : auto-dérision sur un défaut mineur = confiance. Auto-dérision sur quelque chose qui te touche vraiment = pitié.",tip:"Formule parfaite : 'Je suis tellement [défaut mineur] que [conséquence absurde et exagérée].' Livré avec un sourire en coin.",exercise:"Identifie 3 défauts mineurs. Pour chacun, écris une auto-dérision calibrée. Teste-les cette semaine."},
    {title:"Le callback",body:"Reprendre un mot ou image dit en début de conversation et le replacer inattendu 15 minutes plus tard. Effet : la personne réalise que tu l'écoutais vraiment. C'est la technique des meilleurs comédiens, négociateurs, personnes mémorables.",tip:"Mémorise 1 mot inhabituel dit en début de conv. Cherche activement l'occasion de le placer dans un contexte totalement différent.",exercise:"Dans ta prochaine conversation de 20+ minutes : identifie le callback potentiel dans les 5 premières minutes. Replace-le dans les 15 dernières."},
    {title:"Humour et connexion profonde",body:"Le rire partagé crée une synchronie neurologique réelle — vos cerveaux se synchronisent littéralement. C'est pourquoi les couples qui rient ensemble restent ensemble. Développer ton humour, c'est investir dans la qualité de toutes tes relations.",tip:"Crée un 'langage interne' avec les gens importants : une blague récurrente, une référence commune, un callback permanent.",exercise:"Identifie 2 personnes avec qui créer ce lien. Cherche activement quelque chose à transformer en référence commune cette semaine."},
  ]},
  {id:"s3",title:"Lire les Gens",emoji:"🧠",color:C.purple,desc:"Comprendre une personne en 5 minutes — la compétence la plus rare.",
  lessons:[
    {title:"Les 4 canaux de lecture",body:"Mots = 7% de l'impact. Ton de voix = 38%. Langage corporel = 55%. Micro-expressions = invisible sauf si tu cherches (0.2s de vrai ressenti). Quand ces canaux sont congruents : la personne dit ce qu'elle pense. Quand ils divergent : le corps dit toujours la vérité.",tip:"Règle absolue : mots et ton divergent → crois le ton. Ton et corps divergent → crois le corps.",exercise:"Mute une série 10 minutes. Lis uniquement le langage corporel. Essaie de suivre l'histoire. Tu seras surpris."},
    {title:"Signaux d'intérêt réel vs poli",body:"Intérêt réel : questions de suivi, orientation du corps vers toi, ralentissement (poser son téléphone), rythme vocal qui monte légèrement. Intérêt poli : sourires fixes et symétriques, réponses courtes, regard qui dévie fréquemment.",tip:"Test : pose une question ouverte. Compte les mots dans la réponse. Moins de 10 = poli. Plus de 20 = intérêt réel.",exercise:"Lors d'une conversation de groupe, identifie qui est vraiment intéressé par qui. Langage corporel uniquement."},
    {title:"Styles d'attachement en pratique",body:"Anxieux : hypervigilant, cherche validation, parle beaucoup. Évitant : minimise les émotions, répond court, blague pour fuir le profond. Secure : contact visuel stable, écoute active, à l'aise dans le silence. Identifier le style = adapter son énergie immédiatement.",tip:"Chaleur et validation avec l'anxieux. Espace et légèreté avec l'évitant. Directness et profondeur avec le secure.",exercise:"Identifie le style de 3 personnes proches. Change délibérément ton approche avec l'une d'elles. Note ce qui change."},
    {title:"Détecter l'inauthenticité",body:"Patterns reconnaissables : validation excessive en début de conv (fausse intimité rapide), pivots soudains quand ça touche quelque chose de vrai, incongruence chronique corps/mots, questions sur toi mais réponses sur eux. Règle des 3 rencontres : il faut 3 interactions pour avoir une image fiable.",tip:"La cohérence dans le temps est le seul indicateur fiable. Un vrai intérêt est constant. Un intérêt stratégique fluctue selon l'utilité.",exercise:"Revois quelqu'un qui t'a semblé inauthentique. Identifie rétrospectivement 3 signaux concrets qui auraient dû alerter."},
    {title:"Profil mental rapide",body:"En 5 minutes tu peux construire : style d'attachement, canal préférentiel (vocabulaire visuel/auditif/kinesthésique), niveau d'énergie sociale (introverti/extraverti — comment il réagit au silence), et valeurs core (sur quoi il revient toujours = ce qui compte vraiment).",tip:"Question la plus révélatrice : 'C'est quoi un truc qui compte vraiment pour toi en ce moment ?' Valeurs + introspection + attachement en 30 secondes.",exercise:"Après ta prochaine conversation avec quelqu'un de nouveau, écris son profil en 5 lignes. Vérifie à la prochaine interaction."},
  ]},
  {id:"s4",title:"Créer la Connexion",emoji:"🔥",color:C.red,desc:"De l'inconnu à la personne mémorable en une seule conversation.",
  lessons:[
    {title:"La question qui ouvre tout",body:"Questions qui ferment = appel à un bilan factuel. Questions qui ouvrent = invitation à partager quelque chose de vrai. 'Tu fais quoi dans la vie ?' ferme. 'C'est quoi le truc qui t'excite en ce moment ?' ouvre. La première active la mémoire. La seconde active l'imagination et le ressenti.",tip:"Règle d'or : ne pose que des questions auxquelles tu aurais toi-même envie de répondre. Si ça t'ennuie, ça ennuiera l'autre.",exercise:"Liste 10 questions fermées que tu poses souvent. Pour chacune, écris une version ouverte. Utilise-les cette semaine."},
    {title:"L'écho de Voss",body:"Technique du négociateur FBI Chris Voss : répéter les 2-3 derniers mots sous forme de question avec légère montée de ton. 'J'adore voyager.' → 'Tu adores voyager ?' (sourcils levés). Puis silence 2-3s. L'autre développe automatiquement — il se sent entendu et continue à creuser.",tip:"Maximum 2-3 fois par conversation pour ne pas sonner robotique. Réserve-la pour les moments importants.",exercise:"Teste l'écho exactement 2 fois dans ta prochaine conversation. Note ce que l'autre dit après. La profondeur créée te surprendra."},
    {title:"Réciprocité émotionnelle calibrée",body:"Règle absolue : ne va jamais PLUS profond que l'autre vient d'aller. L'autre partage niveau 5 → tu partages niveau 4. Si tu vas à 8 quand l'autre est à 5, tu crées de l'inconfort et tu fermes la conversation. La profondeur se construit progressivement.",tip:"Formule : 'Je comprends exactement — moi j'ai ce truc avec [anecdote 2-3 phrases]. Puis silence. Laisse l'autre reprendre.",exercise:"Dans ta prochaine vraie conversation : mesure mentalement le niveau de profondeur de chaque échange. Reste toujours légèrement en-dessous de l'autre."},
    {title:"L'art de la fin mémorable",body:"La fin d'une conversation est aussi importante que le début. Règle : coupe AVANT le pic d'ennui — quand c'est encore bien. Termine sur une note haute : rire, question ouverte, ou vérité sincère dite simplement. La technique 'to be continued' : interromps une bonne histoire au moment le plus fort.",tip:"'Je te raconterai la suite une prochaine fois.' Elle/il veut cette suite. Tu viens de créer une raison de se revoir.",exercise:"Identifie 3 conversations cette semaine que tu as laissées durer trop longtemps. Qu'aurait été une meilleure fin ?"},
    {title:"La présence — l'arme ultime",body:"Toutes les techniques ne valent rien sans présence réelle. Être là à 100% : ne pas penser à ce que tu diras ensuite, ne pas vérifier mentalement si tu plais, ne pas calculer. Les gens le sentent immédiatement. Quelqu'un qui est vraiment là est magnétique sans rien faire d'autre. C'est la chose la plus rare aujourd'hui.",tip:"Avant chaque conversation importante : 3 respirations profondes. Décide que tu es là pour l'autre, pas pour toi. Cette décision change tout.",exercise:"1 conversation par jour cette semaine à 100%. Pas de téléphone, pas de pensées parasites, pas de calcul. Juste là. Note ce qui se passe."},
  ]},
];

/* ─── DETOX — BRUTAL ─────────────────────────────────────────────────────── */
const DETOX=[
  {month:1,title:"Choc de Réalité",emoji:"💉",color:C.red,
  subtitle:"Mesure l'étendue des dégâts avant de commencer",
  warning:"⚠️ Ce programme est brutal par design. Si tu cherches un 'digital wellness' doux, ce n'est pas ici. Ce programme part du principe que tu as un problème réel avec ton téléphone et que la gentillesse ne changera rien.",
  intro:"Tu ne changes rien encore — mais tu vas réaliser à quel point le problème est profond. La plupart des gens sous-estiment leur usage de 50%. Ce mois, tu ouvres les yeux sur une réalité que tu évites probablement depuis des années.",
  science:"En moyenne : 4h30 de téléphone/jour, 96 déverrouillages, 2617 touches et swipes. Sur une vie de 70 ans actifs = 11 ans passés sur un écran. Le design des apps est conçu par des neuroscientifiques dont l'unique objectif est de maximiser ton temps d'écran. Tu ne luttes pas contre ta volonté — tu luttes contre des milliards de dollars d'ingénierie de l'attention.",
  rules:[
    {title:"Installe le tracking et regarde la vérité en face",desc:"Screen Time (iOS) ou Digital Wellbeing (Android). Ne change RIEN à tes habitudes. Laisse le chiffre apparaître. Ne te justifie pas. Note ta moyenne quotidienne pendant 7 jours.",icon:"📊",hard:false,why:"Tu ne peux pas changer ce que tu refuses de voir."},
    {title:"Journal de chaque prise de téléphone (3 jours)",desc:"Pendant 3 jours consécutifs, note CHAQUE fois que tu prends le téléphone : heure, raison, émotion. Ennui, anxiété, habitude, FOMO, procrastination. Pas de jugement. Juste les données.",icon:"📓",hard:false,why:"La conscience du pattern précède le changement du pattern. Sans ça, tout le reste est superficiel."},
    {title:"Identifie tes 3 apps 'crack'",desc:"Quelles sont les 3 apps qui t'engloutissent ? Instagram, TikTok, YouTube, Twitter, jeux ? Nomme-les. Regarde le temps passé dessus ce mois. Sois honnête avec toi-même.",icon:"🎯",hard:false,why:"Ces apps sont conçues pour être addictives. Les nommer, c'est sortir de l'autopilote."},
    {title:"Pas de téléphone aux toilettes — dès maintenant",desc:"Commence par ça. Ça semble ridicule. C'est précisément pour ça que c'est efficace : tes toilettes sont un des derniers endroits sans stimulation. Le cerveau a besoin de ces 5 minutes non-structurées.",icon:"🚽",hard:false,why:"10 minutes/jour × 365 jours = 60 heures de traitement mental supprimé par le scroll. Ce temps revient dès demain."},
    {title:"Note combien de minutes après le réveil tu prends ton téléphone",desc:"Juste mesurer. Chaque matin. Sans juger. La plupart des gens : moins de 5 minutes. Certains : avant même de se lever.",icon:"⏱️",hard:false,why:"Le matin est la fenêtre neurologique la plus précieuse de la journée. Mesurer, c'est commencer à la protéger."},
    {title:"Compte tes notifications sur une journée",desc:"Compte-les toutes. Chaque app, chaque buzz, chaque bannière. Multiplie par 23 minutes — c'est le temps de récupération de concentration après chaque interruption (étude UC Irvine).",icon:"🔔",hard:false,why:"La plupart des gens ont 60-100 notifications par jour. Ça représente potentiellement 23-38 heures de concentration fragmentée par semaine."},
    {title:"Calcule le coût réel de ton usage",desc:"Prends ton temps d'écran quotidien moyen. Multiplie par 365. Multiplie par les années restantes. Regarde ce chiffre. Est-ce que c'est ce que tu veux faire de ton temps de vie ?",icon:"💀",hard:false,why:"Ce calcul est brutal. C'est intentionnel. Il est impossible de changer sans réaliser ce qu'on sacrifie vraiment."},
  ],
  weeklyChallenge:[
    {week:1,challenge:"CHOC DE DONNÉES : Installe le tracking. Laisse tourner 7 jours sans rien changer. Le dimanche soir, note ton temps d'écran total sur la semaine en HEURES. Compare à ta propre estimation avant de regarder.",tip:"La plupart des gens sous-estiment de 40-60%. La surprise est la première étape."},
    {week:2,challenge:"AUDIT BRUTAL : Classe toutes tes apps en 3 colonnes sur papier — Utile, Parfois utile, Vide total. Compte le temps sur chaque catégorie. Le temps sur 'Vide total' = le temps que tu voles à ta propre vie.",tip:"'Vide total' ne veut pas dire 'jamais de valeur'. Ça veut dire : si tu le supprimais demain, ta vie serait meilleure dans 3 semaines."},
    {week:3,challenge:"ANALYSE DES TRIGGERS : Pendant 5 jours, identifie l'émotion AVANT chaque prise de téléphone. Ennui ? Anxiété ? Habitude pure ? Procrastination ? FOMO ? Note laquelle revient le plus. C'est ton trigger principal.",tip:"Le trigger principal révèle ce que le téléphone remplace dans ta vie. C'est la vraie question derrière l'usage."},
    {week:4,challenge:"LE CALCUL DE VIE : Prends ta moyenne quotidienne. Multiplie par 365 × 40 ans restants. Écris ce chiffre en heures, puis en jours, puis en années. Maintenant écris ce que tu pourrais faire avec ce temps.",tip:"Ce n'est pas pour te culpabiliser. C'est pour créer une motivation qui dépasse la volonté."},
  ],xp:20},

  {month:2,title:"Suppression Chirurgicale",emoji:"🔪",color:C.orange,
  subtitle:"Amputer les sources — pas de négociation",
  warning:"⚠️ Ce mois, tu supprimes des choses. Pas 'tu réduis'. Pas 'tu fais attention'. Tu SUPPRIMES. Si tu n'es pas prêt à ça, reste au mois 1.",
  intro:"La phase 1, c'était la prise de conscience. La phase 2, c'est l'action brutale. Tu vas supprimer tes apps 'crack' pour 30 jours. Pas désinstaller temporairement. Supprimer. Voir si le monde s'effondre (il ne s'effondrera pas).",
  science:"Une étude de Stanford (2018) a montré que supprimer Facebook pendant 4 semaines réduisait les niveaux d'anxiété et augmentait le bien-être subjectif — même chez les gens qui pensaient que Facebook leur manquerait. Le manque dure 3-5 jours. Après : tu ne penses même plus à revenir.",
  rules:[
    {title:"SUPPRIME tes 3 apps 'crack' — maintenant",desc:"Les apps identifiées au mois 1. Supprime-les. Pas de mode hors-ligne, pas de 'je vais juste réduire'. Suppression physique. Tu les réinstalleras si tu en as VRAIMENT besoin après 30 jours.",icon:"🗑️",hard:true,why:"La friction zéro = rechute certaine. La friction totale = tu te rends compte que tu n'en as pas besoin."},
    {title:"Toutes les notifications push désactivées — toutes",desc:"Chaque app. Chaque notification. Zéro bannière, zéro son, zéro badge. Tu CHOISIS quand tu consultes. Tu n'es plus convoqué par ton propre téléphone.",icon:"🔕",hard:true,why:"80 notifications/jour × 23min de récupération = potentiellement 30h de concentration fragmentée par semaine. Suppression totale = récupérer ce temps."},
    {title:"Mode avion dès que tu te couches",desc:"Pas d'exception. Dès que tu t'allonges pour dormir, mode avion. Ton cerveau ne maintient plus un état d'alerte pour des notifications hypothétiques. La qualité du sommeil s'améliore en 3 nuits.",icon:"✈️",hard:false,why:"L'anxiété d'attente de notifications maintient le cerveau en état d'alerte légère même pendant le sommeil. Mode avion = cerveau qui se coupe vraiment."},
    {title:"Téléphone hors de la chambre la nuit",desc:"Pas juste mode avion — physiquement absent de la chambre. Dans le couloir, le salon, peu importe. La chambre devient un espace de repos et de présence. Réveil classique si besoin.",icon:"🛏️",hard:true,why:"La présence physique du téléphone, même éteint, maintient une disponibilité mentale. Son absence physique = coupure mentale totale."},
    {title:"Zéro réseaux sociaux avant midi — sans exception",desc:"Instagram, TikTok, Twitter, Snapchat, Reddit. Rien avant 12h. Le matin t'appartient. Pas de '2 minutes pour vérifier'. C'est toujours 20 minutes.",icon:"🌅",hard:true,why:"Le matin est l'état neurologique le plus précieux (état alpha — créativité et résolution de problèmes). Le scroll en mode réactif tue cet état en 30 secondes."},
    {title:"Réponds aux messages en 2 créneaux seulement",desc:"Matin (9h-9h30) et soir (19h-19h30). Entre les deux, silence total. Préviens tes proches une fois. Les urgences réelles méritent un appel.",icon:"📨",hard:true,why:"La disponibilité permanente crée une anxiété réciproque pour tout le monde. Briser ce cycle libère mentalement toi ET les autres."},
    {title:"Supprime les actualités de ton téléphone",desc:"Apps d'actualités supprimées. Alertes d'actualités désactivées. Les nouvelles importantes te trouveront. Le reste est du bruit conçu pour maintenir ton attention dans un état d'anxiété chronique.",icon:"📰",hard:true,why:"Les actualités en continu sont optimisées pour l'alarme, pas pour l'information. Elles créent une anxiété de fond permanente sans aucune valeur actionnable."},
    {title:"Premier matin sans téléphone (30 premières minutes)",desc:"Dès le réveil, 30 minutes sans téléphone. Eau, café, étirements, marche, séance cali. Le téléphone reste hors de portée physique jusqu'à ce que tu sois debout et actif.",icon:"☀️",hard:false,why:"Ces 30 minutes définissent le ton neuro-hormonal de toute la journée. C'est l'investissement le plus rentable du programme."},
  ],
  weeklyChallenge:[
    {week:1,challenge:"JOUR J DE SUPPRESSION : Supprime tes 3 apps 'crack'. Maintenant. Pas à la fin de la semaine. Maintenant. Note l'heure exacte. Pendant 7 jours : note chaque fois que tu as réflexe de les ouvrir.",tip:"Ce réflexe sans objet (ouvrir l'app qui n'existe plus) est la preuve de l'automatisme. Observer ce réflexe est libérateur."},
    {week:2,challenge:"MATIN LIBÉRÉ : Pendant 7 jours, zéro téléphone pendant les 30 premières minutes après le réveil. Note ce que tu fais à la place. Note si tu es différent dans la journée.",tip:"La différence est souvent remarquée dès le 3e jour. Moins d'anxiété de fond, plus de clarté mentale le matin."},
    {week:3,challenge:"SORTIE SANS TÉLÉPHONE : Une sortie de 3 heures cette semaine, téléphone à la maison. Café, marche, sport, peu importe. Note ce que tu ressens : inconfort ? liberté ? les deux ?",tip:"L'inconfort des premières 20-30 minutes est réel. Après, quelque chose d'inattendu arrive : tu remarques le monde autour de toi."},
    {week:4,challenge:"BILAN DU CHOC : Compare ton temps d'écran semaine 1 vs semaine 4. Note les apps disparues. Note ce qui a changé dans ton niveau d'anxiété, ta concentration, ta présence en société.",tip:"Si ton temps d'écran n'a pas baissé d'au moins 30%, identifie ce qui a remplacé les apps supprimées. Il y a toujours un substitut."},
  ],xp:50},

  {month:3,title:"Reconstruction des Réflexes",emoji:"🏗️",color:C.accent,
  subtitle:"Remplacer les automatismes vides par des choix conscients",
  warning:"⚠️ Ce mois, tu t'attaques aux 50 prises de téléphone par jour qui n'ont pas de raison d'être. La règle des 3 secondes est obligatoire à partir de maintenant.",
  intro:"Tu as supprimé les sources principales. Maintenant tu travailles sur les réflexes qui restent — ces mouvements de main vers la poche, ces déverrouillages sans raison, ces vérifications compulsives. C'est le travail le plus profond du programme.",
  science:"Le réflexe de prendre le téléphone est un loop neurologique : trigger → action → récompense. Pour le briser, tu dois insérer une friction entre le trigger et l'action. 3 secondes suffisent pour activer le cortex préfrontal — la partie rationnelle du cerveau. Sans cette friction, l'habitude continue indéfiniment.",
  rules:[
    {title:"LA RÈGLE DES 3 SECONDES — obligatoire",desc:"Avant de déverrouiller ton téléphone, compte 3 secondes et dis mentalement : 'Pour quoi exactement ?' Si tu n'as pas de réponse précise et spécifique, repose-le. Pas une réponse vague — une raison précise.",icon:"3️⃣",hard:true,why:"Cette friction de 3s active le cortex préfrontal. Sans elle, l'amygdale (réflexe) prend le dessus à chaque fois."},
    {title:"Téléphone hors de portée pendant les repas",desc:"Pas juste face retournée — hors de portée physique. Dans un autre sac, une autre pièce, un autre endroit. Pendant chaque repas. Même seul. Le repas = déconnexion et présence.",icon:"🍽️",hard:true,why:"La présence visible d'un téléphone réduit la qualité des conversations de 20% même s'il est éteint (étude Essex University)."},
    {title:"Zéro scroll avant l'entraînement cali",desc:"Avant ta séance, zéro téléphone. La dopamine et l'énergie vont au corps, pas à l'écran. Ta séance sera objectivement meilleure. Teste 2 semaines et compare.",icon:"🤸",hard:true,why:"Le scroll pre-training active le mode réactif du cerveau. L'entraînement demande le mode proactif. Les deux sont incompatibles."},
    {title:"Remplacer scroll → livre (règle du réflexe)",desc:"Chaque fois que tu prends le téléphone par ennui et que tu le reposes grâce à la règle des 3s : tu ouvres un livre à la place. Pas de négociation. Le livre est toujours à portée.",icon:"📚",hard:false,why:"Le transfert d'habitude fonctionne uniquement si le comportement de remplacement est préparé à l'avance. Prépare ton livre maintenant."},
    {title:"Appel plutôt que message (au moins 1×/jour)",desc:"Pour chaque conversation qui dépasse 3 échanges de texte : appelle. Un appel de 3 minutes remplace 20 messages. Et crée une vraie connexion.",icon:"📞",hard:false,why:"Les messages créent une illusion de connexion. L'appel crée une vraie connexion. La différence neurologique est réelle."},
    {title:"Un trajet par jour sans écouteurs",desc:"Marche, métro, voiture, vélo. Un trajet, sans écouteurs, sans podcast, sans musique. Laisse ton cerveau traiter ses propres pensées dans un silence non-structuré.",icon:"🎧",hard:false,why:"L'ennui non-structuré est l'état dans lequel le cerveau crée, résout des problèmes, et traite les émotions. C'est précieux. Tu le supprimes en permanence."},
    {title:"Bloc de 3h sans téléphone par jour",desc:"3 heures continues. Pas 3 fois 1 heure — 3 heures d'affilée. Téléphone dans une autre pièce. Ce bloc est inviolable comme ta séance d'entraînement.",icon:"⏳",hard:true,why:"La concentration profonde demande au moins 90 minutes pour atteindre son niveau optimal. Tu ne l'atteins jamais si tu te coupes toutes les 15 minutes."},
    {title:"Pas de second écran",desc:"Quand tu regardes quelque chose (film, série, vidéo), pas de téléphone en parallèle. Présence totale à ce que tu consommes — ou ne le consomme pas du tout.",icon:"📺",hard:true,why:"Le double écran fragmente l'attention sans satisfaire pleinement aucun des deux. C'est la pire façon de consommer du contenu."},
  ],
  weeklyChallenge:[
    {week:1,challenge:"7 JOURS DE RÈGLE DES 3S : Applique la règle des 3 secondes à CHAQUE prise de téléphone. Note combien de fois tu l'as reposé sans rien faire. Objectif minimum : 20 fois dans la semaine.",tip:"Si tu n'arrives pas à 20, c'est que tu contournes la règle. La règle ne marche que si tu l'appliques même quand tu 'as vraiment envie'."},
    {week:2,challenge:"DEMI-JOURNÉE ZÉRO RÉSEAUX : Un jour cette semaine, de ton réveil jusqu'à 14h, zéro réseaux sociaux. Pas de 'juste vérifier'. Pas d'exception. Note ce qui se passe en toi.",tip:"L'anxiété des premières heures est réelle. Après 14h, la plupart des gens rapportent un sentiment de légèreté inattendu."},
    {week:3,challenge:"3 APPELS AU LIEU DE MESSAGES : Cette semaine, pour 3 conversations importantes, appelle au lieu d'envoyer des messages. Note la différence de qualité de la connexion.",tip:"L'inconfort d'appeler 'sans raison précise' est précisément ce qu'il faut réentraîner. La connexion réelle demande cette vulnérabilité."},
    {week:4,challenge:"BILAN DES RÉFLEXES : Combien de fois par jour prends-tu encore le téléphone sans raison ? Compare à ton journal du mois 1. Identifie LE trigger résiduel le plus fort. Écris un plan de remplacement.",tip:"Il restera toujours un trigger résiduel. L'identifier précisément est plus utile que de se promettre vaguement de 'faire attention'."},
  ],xp:60},

  {month:4,title:"Profondeur de Focus",emoji:"🌊",color:C.blue,
  subtitle:"Reconstruire la concentration longue — la compétence la plus rare du 21e siècle",
  warning:"⚠️ Ce mois est le plus difficile cognitivement. La concentration longue fait mal au début — c'est normal. C'est de la résistance neuronale, pas une incapacité.",
  intro:"10 ans de scroll court ont fragmenté ta capacité à rester sur quelque chose de difficile plus de 2-3 minutes. Ce mois, tu rebuilds cette capacité par le travail. Pas de raccourci. Pas de progressivité excessive. On passe directement aux blocs profonds.",
  science:"Une méta-analyse de l'Université de Californie (2020) a montré que la capacité de concentration longue est neuroplastique — elle se reconstruit en 4 à 8 semaines de pratique délibérée. L'étude Microsoft (2015) : attention moyenne passée de 12s à 8s depuis les smartphones. C'est réversible. Mais ça demande de l'inconfort volontaire.",
  rules:[
    {title:"Blocs de travail profond de 90 minutes MINIMUM",desc:"Téléphone dans une autre pièce. Pas de notifications. 90 minutes de travail ou apprentissage ininterrompu. Si tu penses à ton téléphone — note l'envie sur un papier et continue. Tu le regarderas après.",icon:"🎯",hard:true,why:"La concentration profonde prend 23 minutes à atteindre après une interruption. 90 minutes sans interruption = 23 minutes à atteindre + 67 minutes de travail réel."},
    {title:"Supprimer TikTok, Reels, Shorts DÉFINITIVEMENT",desc:"Pas pour un mois. Définitivement. Le contenu de moins de 60 secondes court-circuite le circuit de récompense du cerveau et rend la concentration longue biologiquement douloureuse. C'est conçu pour ça.",icon:"🚫",hard:true,why:"L'exposition régulière aux formats ultra-courts réduit la capacité à traiter des contenus plus longs. Ce n'est pas métaphorique — c'est une modification neurologique mesurable."},
    {title:"Zéro écran 1h avant de dormir",desc:"Pas juste le téléphone — pas de Netflix, pas d'ordi, pas de tablette. Livre, étirements, conversation, musique. La mélatonine remonte en 2-3 semaines.",icon:"🌙",hard:true,why:"La lumière bleue supprime la mélatonine de 50% pendant 3 heures. Une heure de coupure = récupération partielle mais significative de la qualité du sommeil."},
    {title:"4 heures sans téléphone par jour — blocs",desc:"Matin (1h30 avant tout) + après-midi (1h30 de bloc travail) + soirée (1h). Les 4 heures ne sont pas consécutives mais chaque bloc est inviolable.",icon:"⏳",hard:true,why:"4 heures sans téléphone = environ 30% du temps éveillé. C'est le minimum pour des effets cognitifs mesurables."},
    {title:"Lire 20 pages par jour — physiquement",desc:"Un livre physique. Pas Kindle sur téléphone. 20 pages d'affilée sans pause. Si ton esprit part, tu restes sur la page. La concentration se reconstruit page par page.",icon:"📖",hard:false,why:"La lecture profonde est l'exercice de concentration le plus efficace qui existe. 20 pages/jour = 7300 pages/an = environ 20-25 livres."},
    {title:"Soirée hebdomadaire zéro écran total",desc:"Un soir par semaine : pas de téléphone, pas de TV, pas d'ordi. De 19h jusqu'au coucher. Cuisine, musique physique, conversation, dessin, écriture. Peu importe — mais zéro écran.",icon:"🕯️",hard:true,why:"Ces soirées sont la preuve que tu peux exister sans écran. La première est difficile. La troisième devient un rituel attendu."},
    {title:"Pas de téléphone pendant les séances cali — définitif",desc:"La séance = espace sacré. Playlist préparée en avance, téléphone hors de portée, zéro scroll entre les séries. Concentration totale = progrès 2× plus rapides.",icon:"💪",hard:true,why:"Scroller entre les séries interrompt la concentration neuromusculaire et le tempo d'entraînement. La suppression du téléphone en séance est une décision définitive."},
    {title:"Mesure hebdomadaire de concentration",desc:"Chaque vendredi : chronomètre combien de temps tu peux travailler sans penser à ton téléphone. C'est ton indicateur de progression. Objectif fin de mois : 45 minutes continues.",icon:"⏱️",hard:false,why:"Ce que tu mesures progresse. Cette métrique simple remplace tous les discours vagues sur 'être moins dépendant'."},
  ],
  weeklyChallenge:[
    {week:1,challenge:"PREMIER BLOC PROFOND : 90 minutes de travail ou apprentissage, téléphone dans une autre pièce. Note combien de fois tu as pensé à ton téléphone. Note ce que tu as accompli.",tip:"Si tu n'arrives pas à 90 minutes la première fois, commence à 45 et augmente chaque jour de 5 minutes."},
    {week:2,challenge:"SOIRÉE SANS ÉCRAN : Un soir complet, de 19h au coucher, zéro écran. Prépare à l'avance ce que tu vas faire (cuisine d'un plat complexe, lecture, instrument de musique). Ne prépare pas rien — l'ennui non préparé pousse vers l'écran.",tip:"La première heure est la plus difficile. Après, quelque chose d'inhabituel se passe : tu te souviens de ce que tu aimais faire."},
    {week:3,challenge:"SUPPRESSION DÉFINITIVE DES FORMATS COURTS : Supprime TikTok, Reels, Shorts de façon permanente. Si l'app ne permet pas de désactiver Reels (Instagram), supprime l'app.",tip:"7 jours sans contenu court. Note si ta capacité à lire ou regarder des contenus longs change. Elle changera."},
    {week:4,challenge:"BILAN CONCENTRATION : Mesure ta concentration maximale (combien de minutes sans penser au téléphone). Compare à semaine 1. Calcule la progression. Compare ton temps d'écran mois 4 vs mois 1.",tip:"Objectif raisonnable après 4 semaines : +20-30 minutes de concentration maximale. L'objectif à long terme : 90+ minutes naturellement."},
  ],xp:75},

  {month:5,title:"Présence Totale",emoji:"🔥",color:C.purple,
  subtitle:"Être là où tu es — le téléphone invisible en société",
  warning:"⚠️ Ce mois attaque le comportement social. Les règles concernent la façon dont tu utilises le téléphone EN PRÉSENCE DES AUTRES. C'est là que l'impact est le plus immédiat et le plus visible.",
  intro:"La présence est l'arme sociale ultime. Quelqu'un qui est là à 100%, sans téléphone, sans pensée parasite — est magnétique. Des chercheurs d'Essex ont prouvé que la seule PRÉSENCE VISIBLE d'un téléphone sur la table (éteint) réduit la qualité de la connexion perçue. Tu vas corriger ça définitivement.",
  science:"Étude University of Essex (2012) : la simple présence d'un téléphone sur une table entre deux personnes réduit la qualité de la connexion, la confiance, et l'empathie perçue — même s'il est éteint et que personne n'y touche. Étude Microsoft (2022) : les personnes qui rangent leur téléphone pendant les réunions sont perçues comme plus compétentes et plus engagées par leurs collègues.",
  rules:[
    {title:"Téléphone INVISIBLE en présence des autres",desc:"Quand tu es avec des gens, le téléphone est dans ta poche ou ton sac — pas sur la table, pas dans ta main. Si tu dois l'utiliser, excuses-toi, utilise-le, range-le. Pas de consultation passive.",icon:"👥",hard:true,why:"La présence physique du téléphone signal que tu es potentiellement disponible pour autre chose. C'est un signal de non-présence permanent."},
    {title:"Pas de téléphone aux repas — règle permanente",desc:"Même seul. Le repas = moment de déconnexion, de présence à la nourriture, à l'environnement, à toi-même. Pas d'exception pour 'juste vérifier une chose'.",icon:"🍽️",hard:true,why:"Manger en regardant un écran fragmente l'attention et réduit la pleine conscience alimentaire. C'est aussi une des dernières pratiques de présence à soi dans une journée."},
    {title:"Répondre à chaque personne avec présence totale",desc:"Quand quelqu'un te parle, tu finis ce que tu lisais AVANT de répondre, ou tu poses le téléphone et tu réponds. Jamais à moitié — présence à 100% ou attente d'être disponible.",icon:"👁️",hard:true,why:"Répondre à moitié (mi-téléphone, mi-conversation) est perçu comme un manque de respect même si ce n'est pas l'intention."},
    {title:"5 minutes de silence total par jour",desc:"Assis. Sans rien. Pas de podcast, pas de musique, pas de lecture. Juste toi et tes pensées. Dans les transports, le matin, avant de dormir. 5 minutes. Juste être.",icon:"🧘",hard:false,why:"Ces 5 minutes reconstruisent la tolérance à l'ennui et le dialogue interne. Tu arrêtes de fuir tes propres pensées."},
    {title:"Journaling papier 5 minutes le soir",desc:"Papier et stylo. Pas de notes sur téléphone. 3 lignes : 1 moment vécu pleinement aujourd'hui, 1 moment où tu as résisté au téléphone, 1 intention pour demain.",icon:"📝",hard:false,why:"L'écriture sur papier engage différemment le cerveau que la frappe. Elle force la synthèse plutôt que le déversement."},
    {title:"Prévenir ton entourage de ta disponibilité",desc:"Dis clairement à tes proches : tu répondras aux messages en 2 créneaux, les urgences méritent un appel. C'est un acte de respect — pas de la distance. Ça libère tout le monde.",icon:"💬",hard:false,why:"La disponibilité permanente est une attente sociale imposée, pas une nécessité. La déconstruire explicitement change les dynamiques."},
    {title:"Un weekend sans réseaux sociaux",desc:"Samedi et dimanche. Zéro consultation, zéro publication, zéro vérification. Préviens vendredi. Note ce que tu fais à la place. Note comment tu te sens le dimanche soir.",icon:"📵",hard:true,why:"La plupart des gens rapportent moins d'anxiété dès le samedi après-midi. Le FOMO dure 4-6 heures. Après, c'est de la liberté."},
    {title:"Une activité IRL sans téléphone par semaine",desc:"Quelque chose qui demande ta présence physique totale : sport collectif, concert, café, marché, musée, cuisine élaborée. Téléphone à la maison. Pas de photos pour prouver que tu y étais.",icon:"🌍",hard:false,why:"'Les photos pour les réseaux' sont une façon de ne pas vraiment vivre l'expérience. Ne pas documenter = être vraiment là."},
  ],
  weeklyChallenge:[
    {week:1,challenge:"REPAS AVEC DES GENS : Un repas complet avec des amis ou famille, téléphone dans le sac ou la veste. Pour tout le monde si possible. Observe la différence dans la qualité de la conversation.",tip:"Si les autres sortent leur téléphone, tu n'as pas à suivre. Ta présence est remarquée même sans que tu le dises."},
    {week:2,challenge:"WEEKEND SANS RÉSEAUX : Samedi et dimanche zéro consultation de réseaux sociaux. Pas de pause. Prépare ton weekend à l'avance pour avoir des activités concrètes.",tip:"La tentation de 'juste vérifier' sera la plus forte le samedi matin et le dimanche soir. Anticipe ces moments."},
    {week:3,challenge:"TRAJET CONSCIENT : Cette semaine, un trajet par jour (métro, marche, voiture) sans téléphone ET sans écouteurs. Juste observer l'environnement et les gens.",tip:"Les premières fois c'est inconfortable. Après quelques jours, ces trajets deviennent les moments les plus clairs de la journée."},
    {week:4,challenge:"DIS-LE À VOIX HAUTE : Dans une conversation cette semaine, dis explicitement : 'Je range mon téléphone, je suis là.' Et reste là pour toute la conversation. Note l'effet sur l'autre.",tip:"Cette phrase a un effet immédiat et visible. Tu donnes quelque chose de rare : toute ton attention. C'est perçu comme un cadeau."},
  ],xp:90},

  {month:6,title:"Maîtrise Permanente",emoji:"⚡",color:C.green,
  subtitle:"Le téléphone comme outil — pas comme maître. Pour toujours.",
  warning:"⚠️ Le mois 6 n'est pas la fin. C'est l'instauration d'un nouveau rapport permanent. Si tu rechutes après, tu sais exactement quoi faire — tu l'as fait 5 fois.",
  intro:"Le but final n'a jamais été l'abstinence totale. C'est la maîtrise. Tu utilises le téléphone quand tu le décides, pour ce que tu décides, le temps que tu décides. Et ensuite tu le poses. Ce mois tu formalises ce nouveau rapport et tu le rendras permanent.",
  science:"Étude de l'Université de Nottingham (2019) : les personnes avec un 'usage intentionnel' des smartphones (savoir pourquoi on l'ouvre, faire ce qu'on avait prévu, le reposer) ont des niveaux de bien-être comparables aux non-utilisateurs de réseaux — contrairement à l'usage passif (scroll infini) qui corrèle avec l'anxiété et la dépression.",
  rules:[
    {title:"Usage intentionnel uniquement — règle permanente",desc:"Tu ouvres le téléphone pour une raison précise. Tu fais ce que tu avais prévu. Tu le poses. Pas de 'tant que je suis là je vais vérifier...' Pas de dérive.",icon:"🎯",hard:true,why:"La différence entre usage intentionnel et usage passif est la différence entre un outil et une addiction. Une seule décision à chaque déverrouillage."},
    {title:"Budget écran : 2 heures maximum par jour",desc:"Appels et musique exclus. Tout le reste — réseaux, vidéos, news, scroll, jeux — 2h par jour. Gère-les comme un budget d'argent. Tu décides où chaque minute va.",icon:"⏱️",hard:true,why:"Après 5 mois de travail, 2h/jour est un usage modéré et sain. Le dépasser n'est pas une catastrophe — c'est un signal d'alerte à traiter."},
    {title:"Une journée sans téléphone par semaine — permanente",desc:"Choisis ton jour fixe. Préviens tes proches. Ce jour existe maintenant dans ta vie de façon permanente. Le monde tourne. Tu rentres plus riche chaque semaine.",icon:"📵",hard:true,why:"Une journée par semaine sans téléphone = 52 jours par an. C'est 52 jours de présence totale, de récupération neurologique, et de vraie vie."},
    {title:"Désinstaller définitivement au moins 2 réseaux",desc:"Après 6 mois, tu sais lesquels t'apportent vraiment quelque chose. Les autres : suppression définitive. Pas 'je ferai attention' — suppression physique.",icon:"🗑️",hard:true,why:"Chaque réseau social conservé est une source de distraction potentielle. N'en garde que ceux dont la valeur est clairement supérieure au coût d'attention."},
    {title:"Revue mensuelle d'usage — le 1er de chaque mois",desc:"Chaque 1er du mois : check ton temps d'écran de la semaine précédente. Si la tendance remonte, identifie pourquoi et applique le protocole du mois correspondant.",icon:"📊",hard:false,why:"La rechute silencieuse est le principal danger. Un check mensuel transforme une dérive en correction immédiate."},
    {title:"Partage une règle concrète avec quelqu'un",desc:"Tu as changé ton rapport au téléphone. Partage une règle concrète avec une personne dans ton entourage. Pas pour la convaincre — juste parce que tu l'as vécu et que ça peut servir.",icon:"🌟",hard:false,why:"Enseigner consolide. Et une personne qui change à côté de toi renforce ton propre changement."},
    {title:"Calcule les heures récupérées en 6 mois",desc:"Prends ta moyenne mois 1 moins ta moyenne mois 6, multiplie par 180 jours. Convertis en jours. Écris ce que tu as fait avec ce temps. Prouve-toi que le changement était réel.",icon:"🧮",hard:false,why:"Ce calcul est la preuve tangible. La plupart des gens récupèrent entre 150 et 400 heures sur 6 mois. C'est entre 6 et 17 jours complets de vie récupérée."},
    {title:"Lettre à toi-même du mois 1",desc:"Écris une lettre à la version de toi du mois 1. Qu'est-ce qui a changé physiquement, mentalement, socialement ? Qu'est-ce que tu ferais différemment ? Qu'est-ce que tu gardes pour toujours ?",icon:"✉️",hard:false,why:"Cette lettre est la preuve que tu n'es plus la même personne. Garde-la pour les moments de rechute. Elle dit qui tu es devenu."},
  ],
  weeklyChallenge:[
    {week:1,challenge:"DÉFINITION PERMANENTE : Écris par écrit tes 3 usages légitimes du téléphone (ex: GPS, appels, Spotify). Tout le reste est optionnel. Affiche-les quelque part visible.",tip:"Être obligé de les écrire force à être honnête sur ce dont tu as VRAIMENT besoin vs ce dont tu as l'habitude."},
    {week:2,challenge:"CALCUL DE VIE RÉCUPÉRÉE : Temps d'écran moyen mois 1 − temps d'écran mois 6 = différence/jour. × 180 jours = heures récupérées. ÷ 24 = jours. Qu'as-tu fait avec ce temps ?",tip:"La plupart des gens sont surpris par l'ampleur. Ce calcul transforme le changement abstrait en réalité concrète."},
    {week:3,challenge:"LETTRE À TOI-MÊME : Écris sur papier une lettre à la version de toi du mois 1. Qu'est-ce qui a changé ? Qu'est-ce que tu dirais ? Qu'est-ce que tu gardes pour toujours ?",tip:"Garde cette lettre. Elle dira qui tu es devenu. Relis-la dans un an."},
    {week:4,challenge:"JOUR FINAL — 24H SANS TÉLÉPHONE : Une journée complète. Planifiée, assumée, vécue pleinement. Ce n'est plus un sacrifice — c'est une démonstration à toi-même de qui tu es devenu.",tip:"Tu n'as pas besoin du téléphone autant que tu le croyais au mois 1. 6 mois de preuves."},
  ],xp:100},
];

/* ─── UTILITY COMPONENTS ─────────────────────────────────────────────────── */
const Tag=({children,color=C.accent})=><span style={{fontSize:10,fontWeight:700,letterSpacing:2,color,background:color+"18",border:`1px solid ${color}33`,padding:"3px 10px",borderRadius:3,textTransform:"uppercase"}}>{children}</span>;
const Bar=({v,max,color=C.accent,h=4})=><div style={{background:C.border,borderRadius:h,height:h,overflow:"hidden"}}><div style={{width:`${Math.min(100,(v/max)*100)}%`,height:"100%",background:color,borderRadius:h,transition:"width .5s cubic-bezier(.16,1,.3,1)"}}/></div>;

/* ─── REST TIMER ─────────────────────────────────────────────────────────── */
function RestTimer(){
  const[s,setS]=useState(90);const[run,setRun]=useState(false);const[preset,setPre]=useState(90);const ref=useRef(null);
  useEffect(()=>{if(run&&s>0){ref.current=setTimeout(()=>setS(x=>x-1),1000);}else if(s===0)setRun(false);return()=>clearTimeout(ref.current);},[run,s]);
  const pct=s/preset;const r=28,circ=2*Math.PI*r;
  return(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:16,textAlign:"center"}}>
    <div style={{fontSize:10,letterSpacing:2,color:C.muted,textTransform:"uppercase",marginBottom:12}}>⏱ Timer de repos</div>
    <svg width={80} height={80} style={{display:"block",margin:"0 auto 12px"}}>
      <circle cx={40} cy={40} r={r} fill="none" stroke={C.border} strokeWidth={5}/>
      <circle cx={40} cy={40} r={r} fill="none" stroke={run?C.accent:C.muted} strokeWidth={5} strokeDasharray={circ} strokeDashoffset={circ*(1-pct)} strokeLinecap="round" style={{transform:"rotate(-90deg)",transformOrigin:"center",transition:"stroke-dashoffset .9s linear"}}/>
      <text x={40} y={45} textAnchor="middle" fill={C.text} fontSize={16} fontWeight={800}>{s}s</text>
    </svg>
    <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:10}}>
      {[30,60,90,120].map(p=><button key={p} onClick={()=>{setPre(p);setS(p);setRun(false);}} style={{background:preset===p?C.accent:C.card,color:preset===p?"#000":C.muted,border:`1px solid ${preset===p?C.accent:C.border}`,borderRadius:6,padding:"4px 10px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{p}s</button>)}
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
      <button onClick={()=>setRun(!run)} style={{flex:1,background:run?C.red:C.accent,color:"#000",border:"none",borderRadius:8,padding:"10px",fontWeight:900,fontSize:13,cursor:"pointer"}}>{run?"⏸ PAUSE":"▶ START"}</button>
      <button onClick={()=>{setS(preset);setRun(false);}} style={{background:C.card,color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 14px",fontWeight:700,fontSize:13,cursor:"pointer"}}>↺</button>
    </div>
  </div>);
}

/* ─── ONBOARDING ─────────────────────────────────────────────────────────── */
const CQ=[{id:"pushups",q:"Pompes d'affilée ?",opts:["0–5","6–15","16–30","30+"]},{id:"pullups",q:"Tractions d'affilée ?",opts:["0","1–5","6–10","10+"]},{id:"plank",q:"Durée de gainage ?",opts:["< 30s","30s–1min","1–2min","2min+"]},{id:"freq",q:"Fréquence actuelle ?",opts:["Jamais","1–2×/sem","3–4×/sem","5×+/sem"]}];
const SQ=[{id:"blank",q:"Tu gères les silences ?",opts:["Panique","Un peu gêné","Neutre","À l'aise"]},{id:"humor",q:"Ton timing humour ?",opts:["Jamais osé","Parfois raté","Souvent ok","Parfait"]},{id:"read",q:"Tu lis le non-verbal ?",opts:["Pas du tout","Un peu","Assez bien","Très bien"]},{id:"conf",q:"Confiance en approche ?",opts:["Nulle","Timide","Correcte","Haute"]}];

function Onboarding({onDone}){
  const[step,setStep]=useState("welcome");const[cali,setCali]=useState({});const[goals,setGoals]=useState([]);const[social,setSocial]=useState({});const[qi,setQi]=useState(0);const[vis,setVis]=useState(true);
  const go=fn=>{setVis(false);setTimeout(()=>{fn();setVis(true);},200);};
  const ansC=val=>{const u={...cali,[CQ[qi].id]:val};setCali(u);qi<CQ.length-1?go(()=>setQi(qi+1)):go(()=>{setStep("goals");setQi(0);});};
  const ansS=val=>{const u={...social,[SQ[qi].id]:val};setSocial(u);qi<SQ.length-1?go(()=>setQi(qi+1)):onDone({cali,goals:goals.length?goals:["handstand"],social:u});};
  if(step==="welcome")return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28,textAlign:"center"}}>
    <div style={{fontSize:72,marginBottom:16,filter:`drop-shadow(0 0 28px ${C.accent}55)`}}>🦾</div>
    <div style={{fontSize:10,letterSpacing:5,color:C.accent,marginBottom:12,textTransform:"uppercase"}}>Programme Elite — 6 Mois</div>
    <h1 style={{fontSize:44,fontWeight:900,lineHeight:1.05,marginBottom:20,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3}}>CORPS D'ACIER.<br/><span style={{color:C.accent}}>ESPRIT TRANCHANT.</span></h1>
    <p style={{color:C.muted,maxWidth:320,lineHeight:1.7,marginBottom:20,fontSize:14}}>Handstand Push-ups. Human Flag. Planche.<br/><strong style={{color:C.text}}>Et la capacité de captiver n'importe qui.</strong></p>
    <div style={{background:`${C.red}12`,border:`1px solid ${C.red}44`,borderRadius:12,padding:16,marginBottom:24,maxWidth:320,textAlign:"left"}}>
      <div style={{fontSize:11,color:C.red,fontWeight:700,letterSpacing:2,marginBottom:8,textTransform:"uppercase"}}>⚠️ Ce programme est brutal</div>
      <div style={{fontSize:13,color:C.text,lineHeight:1.65}}>5 séances cali par semaine. Décroissance digitale radicale. Défis sociaux quotidiens. Si tu cherches de la douceur, ce n'est pas ici.</div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:10,justifyContent:"center",marginBottom:36}}>
      {["🤸 5 séances/sem","💪 Push-ups chaque jour","🧠 Social lié à la cali","📵 Détox brutale","⭐ XP & Niveaux","📊 Stats"].map(t=><div key={t} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:8,padding:"7px 13px",fontSize:11}}>{t}</div>)}
    </div>
    <button onClick={()=>setStep("cali")} style={{background:C.accent,color:"#000",border:"none",borderRadius:8,padding:"18px 52px",fontWeight:900,fontSize:22,cursor:"pointer",letterSpacing:2,fontFamily:"'Bebas Neue',sans-serif",boxShadow:`0 0 32px ${C.accent}44`}}>DÉMARRER →</button>
  </div>);
  if(step==="cali"){const q=CQ[qi];return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"60px 24px 24px"}}>
    <Tag>Niveau calisthénie</Tag><div style={{margin:"10px 0 6px"}}><Bar v={qi+1} max={CQ.length}/></div><div style={{fontSize:11,color:C.muted,marginBottom:32}}>{qi+1} / {CQ.length}</div>
    <div style={{opacity:vis?1:0,transition:"opacity .2s",flex:1}}><div style={{fontSize:26,fontWeight:800,marginBottom:32,lineHeight:1.25}}>{q.q}</div>
      {q.opts.map(o=><button key={o} onClick={()=>ansC(o)} style={{display:"block",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",textAlign:"left",color:C.text,fontSize:15,cursor:"pointer",fontWeight:600,marginBottom:10}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.accent;e.currentTarget.style.background=C.cardH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>{o}</button>)}
    </div></div>);}
  if(step==="goals")return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"60px 24px 24px"}}>
    <Tag>Objectifs</Tag><div style={{fontSize:26,fontWeight:800,margin:"12px 0 6px",lineHeight:1.25}}>Tes objectifs<br/><span style={{color:C.accent}}>— plusieurs possibles</span></div>
    <div style={{fontSize:13,color:C.muted,marginBottom:24}}>Le programme s'adapte à tes cibles</div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:24,flex:1}}>
      {GOALS.map(g=>{const on=goals.includes(g.id);return(<button key={g.id} onClick={()=>setGoals(on?goals.filter(x=>x!==g.id):[...goals,g.id])} style={{background:on?`${g.color}22`:C.card,border:`2px solid ${on?g.color:C.border}`,borderRadius:14,padding:"16px 10px",textAlign:"center",cursor:"pointer",color:C.text,transition:"all .15s"}}><div style={{fontSize:28,marginBottom:6}}>{g.emoji}</div><div style={{fontSize:12,fontWeight:800,color:on?g.color:C.text,lineHeight:1.3}}>{g.label}</div>{on&&<div style={{fontSize:10,color:g.color,marginTop:5}}>✓</div>}</button>);})}
    </div>
    <button onClick={()=>goals.length>0&&(setStep("social"),setQi(0))} disabled={!goals.length} style={{background:goals.length?C.accent:C.border,color:goals.length?"#000":C.muted,border:"none",borderRadius:10,padding:18,fontWeight:900,fontSize:16,cursor:goals.length?"pointer":"not-allowed"}}>{goals.length?`Continuer — ${goals.length} objectif${goals.length>1?"s":""}  →`:"Sélectionne au moins 1"}</button>
  </div>);
  {const q=SQ[qi];return(<div style={{minHeight:"100vh",display:"flex",flexDirection:"column",padding:"60px 24px 24px"}}>
    <Tag color={C.blue}>Profil social</Tag><div style={{margin:"10px 0 6px"}}><Bar v={qi+1} max={SQ.length} color={C.blue}/></div><div style={{fontSize:11,color:C.muted,marginBottom:32}}>{qi+1} / {SQ.length}</div>
    <div style={{opacity:vis?1:0,transition:"opacity .2s",flex:1}}><div style={{fontSize:26,fontWeight:800,marginBottom:32,lineHeight:1.25}}>{q.q}</div>
      {q.opts.map(o=><button key={o} onClick={()=>ansS(o)} style={{display:"block",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 20px",textAlign:"left",color:C.text,fontSize:15,cursor:"pointer",fontWeight:600,marginBottom:10}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.background=C.cardH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>{o}</button>)}
    </div></div>);}
}

/* ─── SESSION VIEW ───────────────────────────────────────────────────────── */
function SessionView({month,mIdx,wIdx,sIdx,profile,progress,onComplete,onBack}){
  const ses=month.weeks[wIdx].sessions[sIdx];const pu=getPu(mIdx,wIdx,sIdx);const sc=getSC(mIdx,wIdx,sIdx);
  const key=`${mIdx}-${wIdx}-${sIdx}`;const[checked,setChecked]=useState(progress.exoChecks?.[key]||{});const[scDone,setScDone]=useState(!!(progress.scDone?.[key]));
  const allDone=ses.exos.every((_,i)=>checked[i])&&scDone;
  const toggle=i=>{const n={...checked,[i]:!checked[i]};setChecked(n);onComplete({type:"check",key,checks:n});};
  const typeLabel={observe:"👁 Observer",silence:"🤫 Silence",humor:"😄 Humour",connect:"🔥 Connexion"};
  return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(135deg,${month.color}22,${C.panel})`,padding:"24px 20px",borderBottom:`1px solid ${C.border}`}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:month.color,cursor:"pointer",fontSize:13,marginBottom:12,padding:0}}>← Retour</button>
      <div style={{fontSize:10,color:month.color,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>{ses.day} · Séance {sIdx+1}/5</div>
      <div style={{fontSize:22,fontWeight:900}}>{ses.label}</div>
      {progress.completed?.[key]&&<div style={{marginTop:8,fontSize:11,color:C.green,fontWeight:700}}>✓ Séance complétée !</div>}
    </div>
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
      <div style={{background:`${C.accent}10`,border:`1px solid ${C.accent}44`,borderRadius:12,padding:16}}>
        <div style={{fontSize:10,letterSpacing:2,color:C.accent,textTransform:"uppercase",fontWeight:700,marginBottom:10}}>💪 Push-up du jour</div>
        <div style={{display:"flex",gap:12,alignItems:"center",marginBottom:8}}><span style={{fontSize:32}}>{pu.icon}</span><div><div style={{fontSize:15,fontWeight:800,color:C.accent}}>{pu.name}</div><div style={{fontSize:11,color:C.muted}}>{pu.target} · 3–4 séries en warm-up</div></div></div>
        <div style={{background:`${C.accent}08`,borderRadius:8,padding:"10px 12px"}}><div style={{fontSize:11,color:C.muted,marginBottom:4,letterSpacing:1}}>📐 TECHNIQUE</div><div style={{fontSize:12,color:C.text,lineHeight:1.55}}>{pu.cue}</div></div>
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden"}}>
        <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,fontSize:11,letterSpacing:2,color:C.muted,textTransform:"uppercase"}}>Programme</div>
        {ses.exos.map((ex,i)=><button key={i} onClick={()=>toggle(i)} style={{width:"100%",display:"flex",gap:14,padding:"14px 16px",borderBottom:i<ses.exos.length-1?`1px solid ${C.border}`:"none",alignItems:"center",background:checked[i]?`${month.color}10`:"transparent",cursor:"pointer",border:"none",color:C.text,textAlign:"left"}}>
          <div style={{width:26,height:26,borderRadius:8,border:`2px solid ${checked[i]?month.color:C.muted}`,background:checked[i]?month.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>{checked[i]&&<span style={{color:"#000",fontSize:14,fontWeight:900}}>✓</span>}</div>
          <div style={{fontSize:14,lineHeight:1.5,textDecoration:checked[i]?"line-through":"none",color:checked[i]?C.muted:C.text}}>{ex}</div>
        </button>)}
      </div>
      <RestTimer/>
      <div style={{background:`${sc.color}0e`,border:`2px solid ${scDone?sc.color:sc.color+"44"}`,borderRadius:12,padding:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
          <div><div style={{fontSize:10,letterSpacing:2,color:sc.color,textTransform:"uppercase",fontWeight:700,marginBottom:4}}>🔗 Défi Social du Jour</div><div style={{fontSize:11,color:sc.color,fontWeight:700}}>{typeLabel[sc.type]} · +{sc.xp} XP</div></div>
          {scDone&&<div style={{fontSize:20}}>⭐</div>}
        </div>
        <div style={{fontSize:15,fontWeight:800,marginBottom:8}}>{sc.title}</div>
        <div style={{fontSize:13,color:C.text,lineHeight:1.6,marginBottom:8}}>{sc.desc}</div>
        <div style={{background:`${sc.color}10`,borderRadius:8,padding:"10px 12px",marginBottom:14}}><div style={{fontSize:10,color:sc.color,letterSpacing:1,marginBottom:4,fontWeight:700}}>→ COMMENT</div><div style={{fontSize:12,color:C.muted,lineHeight:1.55}}>{sc.action}</div></div>
        <button onClick={()=>{setScDone(true);onComplete({type:"sc",key,scType:sc.type,xp:sc.xp});}} style={{width:"100%",background:scDone?`${sc.color}22`:sc.color,color:scDone?sc.color:"#000",border:`1px solid ${sc.color}`,borderRadius:8,padding:"12px",fontWeight:900,fontSize:13,cursor:"pointer"}}>{scDone?"✓ Défi accompli !":"Marquer comme fait"}</button>
      </div>
      {!progress.completed?.[key]&&<button onClick={()=>{if(allDone){onComplete({type:"session",key,xpCali:50,xpSocial:sc.xp});onBack();} }} disabled={!allDone} style={{background:allDone?C.accent:C.card,color:allDone?"#000":C.muted,border:`1px solid ${allDone?C.accent:C.border}`,borderRadius:12,padding:"18px",fontWeight:900,cursor:allDone?"pointer":"not-allowed",letterSpacing:1,fontFamily:"'Bebas Neue',sans-serif",fontSize:20}}>{allDone?"🔥 VALIDER LA SÉANCE (+50 XP)":"Complète les exos + le défi social"}</button>}
    </div>
  </div>);
}

/* ─── CALI SCREEN ────────────────────────────────────────────────────────── */
function CaliScreen({profile,progress,onProgress}){
  const[mIdx,setMIdx]=useState(0);const[wIdx,setWIdx]=useState(null);const[sIdx,setSIdx]=useState(null);const[showPu,setShowPu]=useState(false);const month=MONTHS[mIdx];
  if(sIdx!==null&&wIdx!==null)return<SessionView month={month} mIdx={mIdx} wIdx={wIdx} sIdx={sIdx} profile={profile} progress={progress} onComplete={onProgress} onBack={()=>setSIdx(null)}/>;
  if(wIdx!==null){const week=month.weeks[wIdx];return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(135deg,${month.color}20,${C.panel})`,padding:"24px 20px",borderBottom:`1px solid ${C.border}`}}>
      <button onClick={()=>setWIdx(null)} style={{background:"none",border:"none",color:month.color,cursor:"pointer",fontSize:13,marginBottom:12,padding:0}}>← Retour</button>
      <div style={{fontSize:10,color:month.color,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>M{mIdx+1} · Semaine {week.w} — {week.theme}</div>
      <div style={{fontSize:24,fontWeight:900}}>5 séances · 5 défis sociaux</div>
    </div>
    <div style={{padding:"16px 20px",display:"flex",flexDirection:"column",gap:10}}>
      {week.sessions.map((s,si)=>{const pu=getPu(mIdx,wIdx,si);const sc=getSC(mIdx,wIdx,si);const done=progress.completed?.[`${mIdx}-${wIdx}-${si}`];return(
        <button key={si} onClick={()=>setSIdx(si)} style={{background:done?`${month.color}12`:C.card,border:`1px solid ${done?month.color:C.border}`,borderRadius:12,padding:"16px 18px",textAlign:"left",cursor:"pointer",color:C.text,display:"flex",justifyContent:"space-between",alignItems:"flex-start"}} onMouseEnter={e=>e.currentTarget.style.borderColor=month.color} onMouseLeave={e=>e.currentTarget.style.borderColor=done?month.color:C.border}>
          <div><div style={{display:"flex",gap:8,alignItems:"center",marginBottom:4}}><div style={{fontSize:10,color:month.color,letterSpacing:2,textTransform:"uppercase",fontWeight:700}}>{s.day}</div>{done&&<div style={{fontSize:10,color:C.green,fontWeight:700}}>✓</div>}</div>
          <div style={{fontSize:15,fontWeight:800,marginBottom:4}}>{s.label}</div>
          <div style={{fontSize:11,color:C.muted}}>{pu.icon} {pu.name}</div>
          <div style={{fontSize:11,color:sc.color,marginTop:3}}>🔗 {sc.title}</div></div>
          <div style={{fontSize:18,color:month.color,marginTop:4}}>→</div>
        </button>);})}
    </div></div>);}
  return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(160deg,#0d0d1a,${C.bg})`,padding:"28px 20px 20px",borderBottom:`1px solid ${C.border}`}}>
      <Tag>Calisthénie</Tag><h2 style={{marginTop:8,fontSize:30,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3}}>6 MOIS <span style={{color:C.accent}}>VERS L'ÉLITE</span></h2>
      <div style={{fontSize:12,color:C.muted,marginTop:4}}>5 séances/sem · Push-up + défi social chaque jour</div>
      {profile?.goals&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>{profile.goals.map(gid=>{const g=GOALS.find(x=>x.id===gid);return g?<div key={gid} style={{background:`${g.color}18`,border:`1px solid ${g.color}44`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:g.color}}>{g.emoji} {g.label}</div>:null;})}</div>}
    </div>
    <div style={{padding:"14px 20px 0"}}>
      <button onClick={()=>setShowPu(!showPu)} style={{width:"100%",background:`${C.accent}10`,border:`1px solid ${C.accent}33`,borderRadius:10,padding:"12px 16px",textAlign:"left",cursor:"pointer",color:C.accent,display:"flex",justifyContent:"space-between"}}><span style={{fontSize:13,fontWeight:700}}>💪 10 variations de push-ups</span><span>{showPu?"▲":"▼"}</span></button>
      {showPu&&<div style={{background:C.card,border:`1px solid ${C.border}`,borderTop:"none",borderRadius:"0 0 10px 10px",padding:12,display:"flex",flexDirection:"column",gap:8}}>
        {PUSHUPS.map((p,i)=><div key={i} style={{background:`${C.accent}08`,borderRadius:8,padding:"10px 12px"}}><div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}><span style={{fontSize:18}}>{p.icon}</span><div><div style={{fontSize:12,fontWeight:700,color:C.accent}}>{p.name}</div><div style={{fontSize:10,color:C.muted}}>{p.target}</div></div></div><div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{p.cue}</div></div>)}
      </div>}
    </div>
    <div style={{overflowX:"auto",padding:"14px 20px",display:"flex",gap:8}}>
      {MONTHS.map((m,i)=><button key={i} onClick={()=>{setMIdx(i);setWIdx(null);setSIdx(null);}} style={{flexShrink:0,background:mIdx===i?m.color:C.card,color:mIdx===i?"#000":C.text,border:`1px solid ${mIdx===i?m.color:C.border}`,borderRadius:8,padding:"10px 14px",cursor:"pointer",fontSize:11,fontWeight:700}}>{m.emoji} M{i+1}</button>)}
    </div>
    <div style={{margin:"0 20px 16px",background:C.card,border:`1px solid ${month.color}44`,borderRadius:14,padding:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
        <div><div style={{fontSize:34,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,color:month.color}}>MOIS {mIdx+1}</div><div style={{fontSize:20,fontWeight:900}}>{month.title}</div></div>
        <div style={{fontSize:44}}>{month.emoji}</div>
      </div>
      <div style={{fontSize:13,color:C.muted,marginBottom:6}}>{month.focus}</div>
      <div style={{fontSize:12,color:C.text,lineHeight:1.6,marginBottom:14,fontStyle:"italic"}}>{month.theory}</div>
      <Bar v={mIdx+1} max={6} color={month.color}/>
    </div>
    <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
      {month.weeks.map((w,wi)=>{const dc=w.sessions.filter((_,si)=>progress.completed?.[`${mIdx}-${wi}-${si}`]).length;return(
        <button key={wi} onClick={()=>setWIdx(wi)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px",textAlign:"left",cursor:"pointer",color:C.text,display:"flex",justifyContent:"space-between",alignItems:"center"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=month.color;e.currentTarget.style.background=C.cardH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>
          <div><div style={{fontSize:10,letterSpacing:2,color:C.muted,textTransform:"uppercase"}}>Semaine {w.w} — {w.theme}</div><div style={{fontSize:14,fontWeight:700,marginTop:4}}>J1 · J2 · J3 · J4 · J5</div>{dc>0&&<div style={{fontSize:11,color:C.green,marginTop:4}}>✓ {dc}/5 faites</div>}</div>
          <div style={{fontSize:18,color:month.color}}>→</div>
        </button>);})}
    </div>
  </div>);
}

/* ─── SOCIAL SCREEN ──────────────────────────────────────────────────────── */
function SocialScreen(){
  const[mi,setMi]=useState(null);const[li,setLi]=useState(null);
  if(li!==null&&mi!==null){const mod=SOCIAL_MODULES[mi],les=mod.lessons[li];return(<div style={{padding:"20px 20px 80px"}}>
    <button onClick={()=>setLi(null)} style={{background:"none",border:"none",color:mod.color,cursor:"pointer",fontSize:13,marginBottom:20,padding:0}}>← Retour</button>
    <Tag color={mod.color}>{mod.title}</Tag><h2 style={{fontSize:22,fontWeight:900,marginTop:12,marginBottom:18,lineHeight:1.3}}>{les.title}</h2>
    <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:20,marginBottom:14}}><p style={{fontSize:14,lineHeight:1.8,margin:0}}>{les.body}</p></div>
    <div style={{background:`${mod.color}0e`,border:`1px solid ${mod.color}44`,borderRadius:12,padding:16,marginBottom:14}}>
      <div style={{fontSize:10,letterSpacing:2,color:mod.color,marginBottom:8,textTransform:"uppercase",fontWeight:700}}>💡 CONSEIL CLÉ</div>
      <p style={{fontSize:13,lineHeight:1.7,margin:0,color:C.text}}>{les.tip}</p>
    </div>
    <div style={{background:"#0a0a14",border:`1px solid ${C.border}`,borderRadius:12,padding:16,marginBottom:20}}>
      <div style={{fontSize:10,letterSpacing:2,color:C.muted,marginBottom:8,textTransform:"uppercase",fontWeight:700}}>⚡ EXERCICE PRATIQUE</div>
      <p style={{fontSize:13,lineHeight:1.7,margin:0,color:C.muted}}>{les.exercise}</p>
    </div>
    <div style={{display:"flex",gap:10}}>
      {li>0&&<button onClick={()=>setLi(li-1)} style={{flex:1,background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:14,color:C.text,cursor:"pointer",fontSize:13,fontWeight:600}}>← Précédent</button>}
      {li<mod.lessons.length-1&&<button onClick={()=>setLi(li+1)} style={{flex:1,background:mod.color,border:"none",borderRadius:10,padding:14,color:"#000",cursor:"pointer",fontSize:13,fontWeight:800}}>Suivant →</button>}
    </div>
  </div>);}
  if(mi!==null){const mod=SOCIAL_MODULES[mi];return(<div style={{padding:"20px 20px 80px"}}>
    <button onClick={()=>setMi(null)} style={{background:"none",border:"none",color:mod.color,cursor:"pointer",fontSize:13,marginBottom:20,padding:0}}>← Retour</button>
    <div style={{fontSize:44,marginBottom:10}}>{mod.emoji}</div><Tag color={mod.color}>Module {mi+1}</Tag>
    <h2 style={{fontSize:28,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,marginTop:8,marginBottom:8}}>{mod.title.toUpperCase()}</h2>
    <p style={{color:C.muted,fontSize:14,marginBottom:28,lineHeight:1.65}}>{mod.desc}</p>
    {mod.lessons.map((l,i)=><button key={i} onClick={()=>setLi(i)} style={{display:"block",width:"100%",background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,textAlign:"left",cursor:"pointer",color:C.text,marginBottom:10}} onMouseEnter={e=>{e.currentTarget.style.borderColor=mod.color;e.currentTarget.style.background=C.cardH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>
      <div style={{fontSize:10,color:mod.color,letterSpacing:2,textTransform:"uppercase",marginBottom:6}}>Leçon {i+1}</div>
      <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{l.title}</div>
      <div style={{fontSize:12,color:C.muted}}>Contenu + conseil + exercice →</div>
    </button>)}
  </div>);}
  return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(160deg,#08101a,${C.bg})`,padding:"28px 20px 20px",borderBottom:`1px solid ${C.border}`}}>
      <Tag color={C.blue}>Connexion & Social</Tag><h2 style={{marginTop:8,fontSize:30,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3}}>L'ART DE <span style={{color:C.blue}}>CAPTIVER</span></h2>
      <div style={{fontSize:12,color:C.muted,marginTop:4}}>4 modules · 20 leçons · liés à chaque séance</div>
    </div>
    <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
      {SOCIAL_MODULES.map((mod,i)=><button key={i} onClick={()=>setMi(i)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:14,padding:"20px 18px",textAlign:"left",cursor:"pointer",color:C.text,display:"flex",gap:16}} onMouseEnter={e=>{e.currentTarget.style.borderColor=mod.color;e.currentTarget.style.background=C.cardH;}} onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.card;}}>
        <div style={{fontSize:38,flexShrink:0}}>{mod.emoji}</div>
        <div><div style={{fontSize:10,color:mod.color,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Module {i+1}</div><div style={{fontSize:17,fontWeight:800,marginBottom:6}}>{mod.title}</div><div style={{fontSize:13,color:C.muted,lineHeight:1.55}}>{mod.desc}</div><div style={{marginTop:10,fontSize:11,color:mod.color}}>{mod.lessons.length} leçons →</div></div>
      </button>)}
    </div>
  </div>);
}

/* ─── DETOX SCREEN ───────────────────────────────────────────────────────── */
function DetoxScreen({progress,onProgress}){
  const[mIdx,setMIdx]=useState(0);const[view,setView]=useState("home");const[selWeek,setSelWeek]=useState(null);
  const dm=DETOX[mIdx];
  const isDoneR=(mi,ri)=>!!(progress.detoxRules||{})[`${mi}-${ri}`];
  const isDoneW=(mi,wi)=>!!(progress.detoxWeeks||{})[`${mi}-${wi}`];
  const mCount=(mi)=>{const m=DETOX[mi];return{r:m.rules.filter((_,ri)=>isDoneR(mi,ri)).length,w:m.weeklyChallenge.filter((_,wi)=>isDoneW(mi,wi)).length,tr:m.rules.length,tw:m.weeklyChallenge.length};};

  if(view==="month")return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(135deg,${dm.color}22,${C.panel})`,padding:"24px 20px",borderBottom:`1px solid ${C.border}`}}>
      <button onClick={()=>setView("home")} style={{background:"none",border:"none",color:dm.color,cursor:"pointer",fontSize:13,marginBottom:12,padding:0}}>← Retour</button>
      <div style={{fontSize:10,color:dm.color,letterSpacing:3,textTransform:"uppercase",marginBottom:4}}>Mois {mIdx+1} · Détox</div>
      <div style={{fontSize:24,fontWeight:900,marginBottom:4}}>{dm.emoji} {dm.title}</div>
      <div style={{fontSize:13,color:C.muted,fontStyle:"italic",marginBottom:14}}>{dm.subtitle}</div>
      <div style={{background:`${C.red}12`,border:`1px solid ${C.red}44`,borderRadius:10,padding:12,marginBottom:12}}>
        <div style={{fontSize:11,color:C.red,fontWeight:700,letterSpacing:1,textTransform:"uppercase",marginBottom:4}}>⚠️ AVERTISSEMENT</div>
        <div style={{fontSize:12,color:C.text,lineHeight:1.55}}>{dm.warning}</div>
      </div>
      <div style={{background:`${dm.color}10`,border:`1px solid ${dm.color}33`,borderRadius:10,padding:14,marginBottom:12}}>
        <div style={{fontSize:13,color:C.text,lineHeight:1.7}}>{dm.intro}</div>
      </div>
      <div style={{background:"#0a0a14",border:`1px solid ${C.border}`,borderRadius:10,padding:14}}>
        <div style={{fontSize:10,letterSpacing:2,color:C.muted,textTransform:"uppercase",marginBottom:6,fontWeight:700}}>🔬 LA SCIENCE</div>
        <div style={{fontSize:12,color:C.muted,lineHeight:1.65,fontStyle:"italic"}}>{dm.science}</div>
      </div>
    </div>
    <div style={{padding:"20px 20px 0"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:11,letterSpacing:2,color:C.muted,textTransform:"uppercase",fontWeight:700}}>Règles du mois</div>
        <div style={{fontSize:11,color:dm.color,fontWeight:700}}>{mCount(mIdx).r}/{mCount(mIdx).tr} faites</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:24}}>
        {dm.rules.map((r,ri)=>{const done=isDoneR(mIdx,ri);return(<button key={ri} onClick={()=>onProgress({type:"detox_rule",key:`${mIdx}-${ri}`})} style={{background:done?`${dm.color}15`:C.card,border:`1px solid ${done?dm.color:C.border}`,borderRadius:12,padding:"16px",textAlign:"left",cursor:"pointer",color:C.text,display:"flex",gap:14,alignItems:"flex-start"}}>
          <div style={{width:34,height:34,borderRadius:10,border:`2px solid ${done?dm.color:C.muted}`,background:done?dm.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:done?16:18,transition:"all .15s"}}>{done?<span style={{color:"#000",fontWeight:900}}>✓</span>:r.icon}</div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:5,flexWrap:"wrap"}}>
              <div style={{fontSize:14,fontWeight:800,color:done?dm.color:C.text}}>{r.title}</div>
              {r.hard&&<span style={{fontSize:9,background:`${C.red}22`,color:C.red,border:`1px solid ${C.red}44`,padding:"2px 7px",borderRadius:4,fontWeight:700,letterSpacing:1}}>BRUTAL</span>}
            </div>
            <div style={{fontSize:12,color:done?C.muted:C.text,lineHeight:1.55,textDecoration:done?"line-through":"none",marginBottom:r.why?8:0}}>{r.desc}</div>
            {r.why&&!done&&<div style={{background:`${dm.color}08`,borderRadius:6,padding:"6px 10px"}}><div style={{fontSize:10,color:dm.color,letterSpacing:1,marginBottom:2,fontWeight:700}}>POURQUOI</div><div style={{fontSize:11,color:C.muted,lineHeight:1.5}}>{r.why}</div></div>}
          </div>
        </button>);})}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:11,letterSpacing:2,color:C.muted,textTransform:"uppercase",fontWeight:700}}>Défis hebdomadaires</div>
        <div style={{fontSize:11,color:dm.color,fontWeight:700}}>{mCount(mIdx).w}/{mCount(mIdx).tw} faits</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:24}}>
        {dm.weeklyChallenge.map((w,wi)=>{const done=isDoneW(mIdx,wi);return(<div key={wi} style={{background:done?`${dm.color}15`:C.card,border:`1px solid ${done?dm.color:C.border}`,borderRadius:12,overflow:"hidden"}}>
          <button onClick={()=>onProgress({type:"detox_week",key:`${mIdx}-${wi}`})} style={{width:"100%",padding:"16px",textAlign:"left",cursor:"pointer",color:C.text,background:"transparent",border:"none",display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:34,height:34,borderRadius:10,border:`2px solid ${done?dm.color:C.muted}`,background:done?dm.color:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:12,fontWeight:900,color:done?"#000":dm.color,transition:"all .15s"}}>{done?"✓":`S${wi+1}`}</div>
            <div style={{flex:1}}><div style={{fontSize:10,color:dm.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:5,fontWeight:700}}>Semaine {wi+1}</div><div style={{fontSize:13,fontWeight:700,color:done?C.muted:C.text,lineHeight:1.5,textDecoration:done?"line-through":"none"}}>{w.challenge}</div></div>
          </button>
          {!done&&<div style={{borderTop:`1px solid ${C.border}`,padding:"10px 16px 14px 64px",background:`${dm.color}06`}}>
            <div style={{fontSize:10,color:dm.color,letterSpacing:1.5,textTransform:"uppercase",marginBottom:4,fontWeight:700}}>💡 CONSEIL</div>
            <div style={{fontSize:12,color:C.muted,lineHeight:1.55,fontStyle:"italic"}}>{w.tip}</div>
          </div>}
        </div>);})}
      </div>
      <div style={{background:`${dm.color}10`,border:`1px solid ${dm.color}33`,borderRadius:10,padding:14,textAlign:"center",marginBottom:20}}>
        <div style={{fontSize:11,color:dm.color,letterSpacing:2,textTransform:"uppercase",marginBottom:4}}>Récompense</div>
        <div style={{fontSize:20,fontWeight:900,color:dm.color}}>+15 XP par règle · +30 XP par défi</div>
      </div>
    </div>
  </div>);

  return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(160deg,#0a0508,${C.bg})`,padding:"28px 20px 20px",borderBottom:`1px solid ${C.border}`}}>
      <Tag color={C.red}>Détox Digitale</Tag>
      <h2 style={{marginTop:8,fontSize:28,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3}}>REPRENDRE LE<br/><span style={{color:C.red}}>CONTRÔLE</span></h2>
      <div style={{fontSize:12,color:C.muted,marginTop:4}}>6 mois · progression brutale · lié au corps et au social</div>
    </div>
    <div style={{padding:20}}>
      <div style={{background:`${C.red}10`,border:`1px solid ${C.red}44`,borderRadius:12,padding:16,marginBottom:20}}>
        <div style={{fontSize:11,letterSpacing:2,color:C.red,textTransform:"uppercase",marginBottom:10,fontWeight:700}}>⚠️ Ce programme est différent</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {[{icon:"💉",t:"Mois 1 : tu mesures l'étendue réelle des dégâts. Pas de changement encore."},
            {icon:"🔪",t:"Mois 2 : tu supprimes tes apps 'crack'. Maintenant. Pas à la fin de la semaine."},
            {icon:"🏗️",t:"Mois 3 : la règle des 3 secondes devient obligatoire à chaque déverrouillage."},
            {icon:"🌊",t:"Mois 4 : blocs de concentration de 90min, formats courts supprimés définitivement."},
            {icon:"🔥",t:"Mois 5 : téléphone invisible en société. Présence totale ou pas du tout."},
            {icon:"⚡",t:"Mois 6 : 2h/jour max, 1 jour sans par semaine. Pour toujours."},
          ].map((it,i)=><div key={i} style={{display:"flex",gap:10,alignItems:"flex-start"}}><span style={{fontSize:16,flexShrink:0}}>{it.icon}</span><div style={{fontSize:12,color:C.text,lineHeight:1.55}}>{it.t}</div></div>)}
        </div>
      </div>
      <div style={{overflowX:"auto",display:"flex",gap:8,marginBottom:20}}>
        {DETOX.map((m,i)=>{const{r,w,tr,tw}=mCount(i);const done=r+w;return(<button key={i} onClick={()=>setMIdx(i)} style={{flexShrink:0,background:mIdx===i?m.color:C.card,color:mIdx===i?"#000":C.text,border:`1px solid ${mIdx===i?m.color:C.border}`,borderRadius:8,padding:"10px 14px",cursor:"pointer",fontSize:11,fontWeight:700}}>
          {m.emoji} M{i+1}{done>0&&<div style={{fontSize:9,color:mIdx===i?"#000":m.color,marginTop:2}}>{done}/{tr+tw}</div>}
        </button>);} )}
      </div>
      {DETOX.filter((_,i)=>i===mIdx).map((m,mi)=>{const{r,w,tr,tw}=mCount(mIdx);const done=r+w;return(<div key={mIdx} style={{background:C.card,border:`1px solid ${m.color}55`,borderRadius:14,padding:20,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div><div style={{fontSize:30,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:2,color:m.color}}>MOIS {mIdx+1}</div><div style={{fontSize:18,fontWeight:900}}>{m.title}</div><div style={{fontSize:12,color:C.muted,fontStyle:"italic",marginTop:2}}>{m.subtitle}</div></div>
          <div style={{fontSize:40}}>{m.emoji}</div>
        </div>
        <div style={{background:`${C.red}12`,border:`1px solid ${C.red}33`,borderRadius:8,padding:"10px 12px",marginBottom:14}}><div style={{fontSize:11,color:C.red,fontWeight:700,letterSpacing:1,marginBottom:4}}>⚠️ AVERTISSEMENT</div><div style={{fontSize:12,color:C.text,lineHeight:1.5}}>{m.warning}</div></div>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}><div style={{fontSize:11,color:C.muted}}>Progression</div><div style={{fontSize:11,color:m.color,fontWeight:700}}>{done}/{tr+tw}</div></div>
        <Bar v={done} max={tr+tw} color={m.color} h={6}/>
        <div style={{marginTop:14}}><button onClick={()=>setView("month")} style={{width:"100%",background:m.color,color:"#000",border:"none",borderRadius:10,padding:"14px",fontWeight:900,fontSize:15,cursor:"pointer",fontFamily:"'Bebas Neue',sans-serif",letterSpacing:1}}>VOIR LE PROGRAMME →</button></div>
      </div>);})}
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:14,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>Les 6 mois de détox</div>
        {DETOX.map((m,i)=>{const{r,w,tr,tw}=mCount(i);const done=r+w;return(<div key={i} style={{display:"flex",gap:12,marginBottom:i<5?14:0,alignItems:"center"}}>
          <div style={{width:34,height:34,borderRadius:"50%",background:`${m.color}22`,border:`1px solid ${m.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{m.emoji}</div>
          <div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><div style={{fontSize:12,fontWeight:700}}>{m.title}</div><div style={{fontSize:11,color:m.color,fontWeight:700}}>{done}/{tr+tw}</div></div><Bar v={done} max={tr+tw} color={m.color} h={3}/></div>
        </div>);})}
      </div>
    </div>
  </div>);
}

/* ─── STATS SCREEN ───────────────────────────────────────────────────────── */
function StatsScreen({progress}){
  const xp=progress.xp||0;const level=Math.floor(xp/200)+1;const sessions=Object.keys(progress.completed||{}).length;const scDone=Object.keys(progress.scDone||{}).length;
  const detoxR=Object.values(progress.detoxRules||{}).filter(Boolean).length;const detoxW=Object.values(progress.detoxWeeks||{}).filter(Boolean).length;
  return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(160deg,#0d0d1a,${C.bg})`,padding:"28px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <Tag color={C.purple}>Statistiques</Tag><h2 style={{marginTop:8,fontSize:30,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3}}>TA <span style={{color:C.purple}}>PROGRESSION</span></h2>
    </div>
    <div style={{padding:20}}>
      <div style={{background:`linear-gradient(135deg,${C.purple}22,${C.card})`,border:`1px solid ${C.purple}44`,borderRadius:14,padding:20,marginBottom:16,textAlign:"center"}}>
        <div style={{fontSize:48,fontWeight:900,fontFamily:"'Bebas Neue',sans-serif",color:C.purple,letterSpacing:2}}>NIVEAU {level}</div>
        <div style={{fontSize:14,color:C.muted,marginBottom:12}}>{xp} XP · encore {200-(xp%200)} XP pour le prochain</div>
        <Bar v={xp%200} max={200} color={C.purple} h={8}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[{label:"Séances cali",val:sessions,icon:"🤸",color:C.accent,max:120},{label:"Défis sociaux",val:scDone,icon:"🔗",color:C.blue,max:120},{label:"XP total",val:xp,icon:"⭐",color:C.purple},{label:"Règles détox",val:detoxR+detoxW,icon:"📵",color:C.red}].map(s=>(
          <div key={s.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 14px"}}>
            <div style={{fontSize:22,marginBottom:6}}>{s.icon}</div><div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.val}</div>
            <div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1,marginBottom:s.max?8:0}}>{s.label}</div>
            {s.max&&<Bar v={typeof s.val==="number"?s.val:0} max={s.max} color={s.color}/>}
          </div>))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:14,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>Avancement cali par mois</div>
        {MONTHS.map((m,mi)=>{const total=m.weeks.reduce((a,w)=>a+w.sessions.length,0);const done=m.weeks.reduce((a,w,wi)=>a+w.sessions.filter((_,si)=>progress.completed?.[`${mi}-${wi}-${si}`]).length,0);return(<div key={mi} style={{marginBottom:mi<5?14:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:13,fontWeight:700}}>{m.emoji} {m.title}</div><div style={{fontSize:12,color:m.color,fontWeight:700}}>{done}/{total}</div></div><Bar v={done} max={total} color={m.color}/></div>);})}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:14,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>Détox par mois</div>
        {DETOX.map((m,mi)=>{const tr=m.rules.length,tw=m.weeklyChallenge.length;const r=m.rules.filter((_,ri)=>!!(progress.detoxRules||{})[`${mi}-${ri}`]).length;const w=m.weeklyChallenge.filter((_,wi)=>!!(progress.detoxWeeks||{})[`${mi}-${wi}`]).length;return(<div key={mi} style={{marginBottom:mi<5?14:0}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><div style={{fontSize:13,fontWeight:700}}>{m.emoji} {m.title}</div><div style={{fontSize:12,color:m.color,fontWeight:700}}>{r+w}/{tr+tw}</div></div><Bar v={r+w} max={tr+tw} color={m.color}/></div>);})}
      </div>
    </div>
  </div>);
}

/* ─── DASHBOARD ──────────────────────────────────────────────────────────── */
function Dashboard({profile,progress}){
  const goalObjs=(profile?.goals||[]).map(g=>GOALS.find(x=>x.id===g)).filter(Boolean);
  const xp=progress.xp||0;const level=Math.floor(xp/200)+1;const sessions=Object.keys(progress.completed||{}).length;
  const tips=["Corps + Esprit + Détox : les 3 pilliers avancent ensemble.","3s de silence après ta phrase = signe de confiance. Pratique-le aujourd'hui.","L-sit 3×20s ce soir. Et pose une vraie question à quelqu'un.","Avant ta séance : zéro réseaux. Après : défi social activé.","Handstand 5min mur. Et observe l'orientation du corps des gens.","Règle des 3s : avant chaque déverrouillage. Sans exception."];
  const[tip]=useState(tips[Math.floor(Math.random()*tips.length)]);
  return(<div style={{padding:"0 0 80px"}}>
    <div style={{background:`linear-gradient(160deg,#0d0d1a,${C.bg})`,padding:"32px 20px 24px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontSize:10,letterSpacing:4,color:C.accent,textTransform:"uppercase",marginBottom:8}}>Programme Elite</div>
      <div style={{fontSize:36,fontFamily:"'Bebas Neue',sans-serif",letterSpacing:3}}>CORPS <span style={{color:C.accent}}>&</span> ESPRIT</div>
      <div style={{display:"flex",gap:10,marginTop:14,flexWrap:"wrap"}}>
        <div style={{background:`${C.purple}22`,border:`1px solid ${C.purple}44`,borderRadius:8,padding:"6px 14px"}}><span style={{fontSize:12,fontWeight:900,color:C.purple}}>⭐ Niv. {level}</span></div>
        <div style={{background:`${C.accent}18`,border:`1px solid ${C.accent}33`,borderRadius:8,padding:"6px 14px"}}><span style={{fontSize:12,fontWeight:700,color:C.accent}}>{xp} XP</span></div>
        <div style={{background:`${C.green}18`,border:`1px solid ${C.green}33`,borderRadius:8,padding:"6px 14px"}}><span style={{fontSize:12,fontWeight:700,color:C.green}}>🤸 {sessions} séances</span></div>
      </div>
      {goalObjs.length>0&&<div style={{display:"flex",flexWrap:"wrap",gap:6,marginTop:12}}>{goalObjs.map(g=><div key={g.id} style={{background:`${g.color}18`,border:`1px solid ${g.color}44`,borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,color:g.color}}>{g.emoji} {g.label}</div>)}</div>}
    </div>
    <div style={{padding:20}}>
      <div style={{background:C.card,border:`1px solid ${C.purple}44`,borderRadius:12,padding:16,marginBottom:16}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><div style={{fontSize:12,fontWeight:700,color:C.purple}}>Niveau {level}</div><div style={{fontSize:11,color:C.muted}}>{xp%200}/200 XP</div></div>
        <Bar v={xp%200} max={200} color={C.purple} h={6}/>
      </div>
      <div style={{background:`linear-gradient(135deg,#0d1520,#0a0f14)`,border:`1px solid ${C.blue}55`,borderRadius:12,padding:18,marginBottom:16}}>
        <div style={{fontSize:10,letterSpacing:2,color:C.blue,textTransform:"uppercase",marginBottom:8}}>🔗 Focus du jour</div>
        <div style={{fontSize:14,fontWeight:600,lineHeight:1.65}}>{tip}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {[{label:"Séances",val:sessions,icon:"🤸",color:C.accent},{label:"Défis social",val:Object.keys(progress.scDone||{}).length,icon:"🔗",color:C.blue},{label:"XP",val:xp,icon:"⭐",color:C.purple},{label:"Détox faites",val:Object.values(progress.detoxRules||{}).filter(Boolean).length+Object.values(progress.detoxWeeks||{}).filter(Boolean).length,icon:"📵",color:C.red}].map(s=>(
          <div key={s.label} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 14px"}}><div style={{fontSize:22,marginBottom:6}}>{s.icon}</div><div style={{fontSize:20,fontWeight:900,color:s.color}}>{s.val}</div><div style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:1}}>{s.label}</div></div>))}
      </div>
      <div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:18,marginBottom:16}}>
        <div style={{fontSize:11,fontWeight:700,marginBottom:14,letterSpacing:2,textTransform:"uppercase",color:C.muted}}>Les 6 mois</div>
        {MONTHS.map((m,i)=><div key={i} style={{display:"flex",gap:12,marginBottom:i<5?12:0,alignItems:"flex-start"}}><div style={{width:28,height:28,borderRadius:"50%",background:`${m.color}22`,border:`1px solid ${m.color}55`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0,color:m.color,fontWeight:800}}>{i+1}</div><div><div style={{fontSize:13,fontWeight:700}}>{m.emoji} {m.title}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{m.focus}</div></div></div>)}
      </div>
    </div>
  </div>);
}

/* ─── APP ────────────────────────────────────────────────────────────────── */
export default function App(){
  const[screen,setScreen]=useState("onboarding");const[tab,setTab]=useState("home");const[profile,setProfile]=useState(null);
  const[progress,setProgress]=useState({xp:0,completed:{},exoChecks:{},scDone:{},scTypes:{},detoxRules:{},detoxWeeks:{}});
  useEffect(()=>{const l=document.createElement("link");l.href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700;800;900&display=swap";l.rel="stylesheet";document.head.appendChild(l);},[]);
  const handleProgress=evt=>{setProgress(prev=>{const n={...prev};
    if(evt.type==="check")n.exoChecks={...n.exoChecks,[evt.key]:evt.checks};
    if(evt.type==="sc"){n.scDone={...n.scDone,[evt.key]:true};n.xp=(n.xp||0)+evt.xp;}
    if(evt.type==="session"&&!n.completed?.[evt.key]){n.completed={...n.completed,[evt.key]:true};n.xp=(n.xp||0)+evt.xpCali;}
    if(evt.type==="detox_rule"){const was=!!(n.detoxRules||{})[evt.key];n.detoxRules={...(n.detoxRules||{}),[evt.key]:!was};if(!was)n.xp=(n.xp||0)+15;}
    if(evt.type==="detox_week"){const was=!!(n.detoxWeeks||{})[evt.key];n.detoxWeeks={...(n.detoxWeeks||{}),[evt.key]:!was};if(!was)n.xp=(n.xp||0)+30;}
    return n;});};
  const nav=[{id:"home",icon:"⚡",label:"Home"},{id:"cali",icon:"🤸",label:"Cali"},{id:"social",icon:"🧠",label:"Social"},{id:"detox",icon:"📵",label:"Détox"},{id:"stats",icon:"📊",label:"Stats"}];
  return(<div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,color:C.text,minHeight:"100vh",maxWidth:480,margin:"0 auto"}}>
    {screen==="onboarding"?<Onboarding onDone={d=>{setProfile(d);setScreen("main");}}/>:
    <><div style={{paddingBottom:70}}>
      {tab==="home"&&<Dashboard profile={profile} progress={progress}/>}
      {tab==="cali"&&<CaliScreen profile={profile} progress={progress} onProgress={handleProgress}/>}
      {tab==="social"&&<SocialScreen/>}
      {tab==="detox"&&<DetoxScreen progress={progress} onProgress={handleProgress}/>}
      {tab==="stats"&&<StatsScreen progress={progress}/>}
    </div>
    <nav style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:C.panel+"ee",borderTop:`1px solid ${C.border}`,display:"flex",justifyContent:"space-around",padding:"10px 0 14px",zIndex:100,backdropFilter:"blur(12px)"}}>
      {nav.map(n=><button key={n.id} onClick={()=>setTab(n.id)} style={{background:"none",border:"none",color:tab===n.id?C.accent:C.muted,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,padding:"4px 8px"}}>
        <span style={{fontSize:19}}>{n.icon}</span><span style={{fontSize:8,fontWeight:700,letterSpacing:1,textTransform:"uppercase"}}>{n.label}</span>
        {tab===n.id&&<div style={{width:4,height:4,borderRadius:"50%",background:C.accent}}/>}
      </button>)}
    </nav></>}
  </div>);
}
