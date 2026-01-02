import { getTranslations } from 'next-intl/server';
import { useTranslations } from 'next-intl';
import { AlertTriangle, Calendar, Info, FileText, Download } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Breadcrumbs } from '@/components/layout/breadcrumbs';
import { PageHeader } from '@/components/pages/page-header';
import Link from 'next/link';
import { generatePageMetadata, BreadcrumbJsonLd } from '@/lib/seo';
import type { Locale } from '@/lib/seo/config';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return generatePageMetadata({
    pageKey: 'coronavirus',
    locale: locale as Locale,
    path: '/informatii-publice/coronavirus',
  });
}

// Mock data - will be replaced by database content
const COVID_UPDATES = [
  {
    date: '11.05.2020',
    title: 'Se deschide piața agroalimentară!',
    content: `Odată cu terminarea stării de urgență, piața agroalimentară, care până acum funcționa în parcare, se va muta înapoi, la locul ei. Vineri, 15 mai, clienții vor fi așteptați în spațiul obișnuit.
Atenţie! Cu excepția alimentelor și a produselor agricole, orice altceva este interzis de comercializat deocamdată! Vă rugăm, să respectați măsurile de prevenție a infectării și în incinta pieței.`,
  },
  {
    date: '27.04.2020',
    title: 'Noi intervale orare pentru persoanele de peste 65 de ani',
    content: `Preşedintele Klaus Iohannis a anunțat azi că urmează să fie dată o nouă ordonanţă militară în care să fie schimbată perioadele de timp în care persoanele de peste 65 de ani pot ieşi din casă.
„Persoanele de peste 65 de ani, având în vedere că vremea se încălzeşte, vor avea la dispoziţie două intervale zilnice: dimineaţă de la 7:00 la 11:00 şi seara de la 19:00 la 22:00", a declarat Klaus Iohannis.`,
  },
  {
    date: '22.04.2020',
    title: 'S-a anulat festivalul Zilele Salontane!',
    content: `Mulți s-au interesat dacă va organiza orașul și anul acesta festivalul care atrage mii de oameni, Zilele Salontane.
Am aflat că autoritățile competente au decis, din cauza pericolului privind sănătatea și a situației economice nesatisfăcătoare, că anul acesta NU se va organiza festivalul Zilele Salontane.
Totodată s-a propus și amânarea festivalului de film, realizat pentru prima dată anul trecut, pe lângă punctele la ordinea zilei ce privesc reducerea a mai multor cheltuieli. Consiliul Local va lua decizii în legătură cu aceste întrebări mâine, prin intermediul unei ședințe online.
Potrivit propunerii Primăriei Salonta, sumele rămase, datorită anulării evenimentelor, orașul le va investi în protejarea sănătății cetățenilor și în a ajuta ieșirea din criza și haosul economic.`,
  },
  {
    date: '22.04.2020',
    title: 'Mănuși și măști pentru salontani!',
    content: `Am mai primit un pachet de sute de perechi de mănusi în această dimineață, și mai avem și rezerve de măști. Dorim să le oferim la cât mai multe persoane. Așteptăm doritorii, la recepția Primăriei le pot prelua în zilele lucrătoare între orele 8-16.`,
  },
  {
    date: '21.04.2020',
    title: 'Primăria Salonta continuă activitatea',
    content: `Primăria Salonta, cu măsurile necesare de prevenție, își continuă activitatea. Cetățenii își pot rezolva problemele online, telefonic, sunând la unul dintre următoarele numere de telefon: 0755328388, 0359409730, 0359409731 sau prin mesaj privat pe pagina noastră de Facebook. Cererile și formularele se pot descărca de pe site-ul Primăriei Salonta. Problemele legate de biroul de evidență a persoanelor se pot rezolva personal. (Tinerii care au împlinit 14 ani pot depune cerere pentru carte de identitate, la fel ca persoanele a căror buletin a fost avariat sau pierdut.) Cărțile de identitate expirate vor rămâne valabile până la sfârșitul stării de urgență). Totodată este deschisă și caseria, și registratura. În plus, doritorii pot beneficia în continuare de măști sanitare, care se pot prelua de la recepția Primăriei. Tot aici împărțim și declarații pe proprie răspundere, gratis.`,
  },
  {
    date: '18.04.2020',
    title: 'Ajutor pentru medici de familie și centrele de bătrâni!',
    content: `Pachetul de ajutor semnificativ al Guvernului Ungariei a ajuns în orașul nostru acum câteva zile. O parte din donație a fost reprezentată de costume de protecție (combinezoane) pe care personalul sanitar le poate folosi în timpul activității profesionale. După ce am întrebat spitalul și am aflat că în prezent sunt asigurați corespunzător cu materiale de protecție, am împărțit costumele între medicii de familie și centrele de bătrâni. Restul donației, măști și mănuși, se împart între cetățeni.`,
  },
  {
    date: '16.04.2020',
    title: 'Mai avem măști!',
    content: `Continuăm împărțirea măștilor sanitare de protecție. Așa cum am spus înainte, datorită sprijinului Guvernului Ungarie și cetățenilor darnici, le putem oferi oamenilor mii de măști sanitare. Doritorii sunt rugați să vină la recepția primăriei, de aici pot prelua măștile, cel mult două pe familie. Persoanele cu vârsta de peste 65 ani și cele care au greutăți în a se deplasa, sunt rugați să ne trimită cerințele prin mesaj privat.`,
  },
  {
    date: '14.04.2020',
    title: 'Dezinfectare',
    content: `Săptămâna aceasta se vor dezinfecta din nou scările blocurilor. Echipele Primăriei Salonta joi vor lucra în zona gării iar miercuri vor trece pe la toate celelalte blocuri din oraș.`,
  },
  {
    date: '10.04.2020',
    title: 'Am reușit să mai achiziționăm măști!',
    content: `Echipamentele de protecție sanitară se găsesc foarte greu, dar pe cele primite sau achiziționate până acum, ne străduim să le împărțim între dvs., pentru a vă proteja. De data aceasta am reușit să obținem 500 măști sanitare de la Direcția Generală de Asistență Socială și Protecția Copilului. Nici pe acestea nu le păstrăm pentru noi. Persoanele care nu au primit încă pot solicita aici, prin mesaj privat. Vă putem oferi maximum două măști / familie pentru a ajunge la cât mai multe. Măștile se pot prelua în zilele lucrătoare între orele 8 și 16 de la recepția primăriei.`,
  },
  {
    date: '10.04.2020',
    title: 'Controlare în centru',
    content: `Cu ocazia sărbătoarei catolice de Vinerea Mare, am rugat poliția să urmăreacă cu atenție respectarea Ordonaței Militare. În zona centrală controlează atât din mașini cât și pe jos. În timpul cumpărăturilor, la farmacii sau la utilizarea ATM-urilor, vă rugăm să păstrați distanța de 1,5 m. Am subliniat în solicitarea noastră, ca unele grupuri, care trăiesc în colonii, în satele din jurul localității noastre să fie ținute acasă. Vă rugăm, dacă vedeți oameni care umblă pe stradă fără niciun scop, nu ezitați să atrageți atenția poliției asupra lor. Nr. de contact al poliției: 0758 225 678. Vă rugăm, Salonta, să respectați regulile. Trecem printr-o perioadă foarte dificilă! Este foarte important să avem grijă unul de altul și dacă aveți posibilitatea, stați acasă.`,
  },
  {
    date: '09.04.2020',
    title: '100 de măști de protecție pentru Spital!',
    content: `Săptămânile trecute, oamenii din Salonta, pe rând au dat dovadă de o colaborare foarte bună. Orașul nostru reprezintă locul voluntariatului, a dăruirii și al ajutorului necondiționat! În mijlocul tuturor necazurilor, acestea ne dau speranță. Zilele trecute, spre marea bucurie a Spitalului Teritorial Salonta, firma Gravostile Industry i-a donat 100 de măști de protecție a feței. Astfel de instrumente se găsesc foarte greu în comerț, dar totodată ele oferă mult ajutor în domeniul medical. Atât primăria cât și conducerea spitalului îi mulțumesc companiei pentru susținere!`,
  },
  {
    date: '08.04.2020',
    title: 'Rețetă medicală electronică',
    content: `În perioada stării de urgență, medicii pot elibera rețetele medicale ai pacienților prin mijloace electronice (e-mail, WhatsApp, Facebook etc.).
După primirea rețetei, pacientul are 2 posibilități:
1. listează rețeta cu care se prezintă la farmacie
2. trimite rețeta primită de la medic pe adresa de mail a farmaciei, iar acesta va lista rețeta.

Pe lângă toate acestea, Primăria Salonta vă este alături în continuare: asistentele noastre, în caz de cerere, vă ajută la cumpărarea medicamentelor.

🔹Farmacia Viva (calea Aradului nr. 4) L-V: 8:00 – 19:00, S: 8:00 – 13:00, D: Închis.
🔹Farmacia Viva (de lângă moară) L-D: 8:00 – 21:00.
🔹Catena (centru) L-V: 8:00 – 21:00, S: 9:00 – 18:00, D: 9:00 – 14:00.
🔹Catena (zona gării) L-V: 8:00 – 21:00, S: 9:00 – 18:00, D: 9:00 – 13:00.
🔹Catena (lângă mag. Degal) L-V: 8:00 – 20:00, S: 9:00 – 18:00, D: Închis.
🔹Farmacia 3 L-V: 8:00 – 18:00, S: 8:00 – 14:00, D: 9:00 – 13:00.
🔹Farmacia Dr. Max L-V: 8:00 – 21:00, S: 9:00 – 19:00, D: 9:00 – 14:00.`,
  },
  {
    date: '08.04.2020',
    title: 'Verificarea temperaturii!',
    content: `Colegii noștri, azi, vor lua temperatura persoanelor, în mai multe zone centrale ale orașului. Conform deciziei Comitetului pentru Situații de Urgență, cei care au temperatură ridicată/febră vor fi îndrumați imediat către medicul de familie.`,
  },
  {
    date: '07.04.2020',
    title: 'Continuăm să ne protejăm!',
    content: `Deși nu prea sunt stocuri și este greu de obținut, s-au instalat primele aparate pentru dezinfectarea mâinilor în scările blocurilor. Continuăm achiziționarea dispozitivelor ca să ajungă în fiecare bloc. Îi mulțumim lui Tasnadi Zsolt si echipei sale pentru că au venit pe gratis în ajutorul nostru și au montat dozatoarele pe care le-am și predat deja către asociațiile de locuitori.

Știm că e greu! Să rezistăm! Noi facem tot posibilul pentru dumneavoastră! Salonta stă bine! Să avem grijă unul de celălalt! Să fim uniți! Stați acasă, salvați vieți!`,
  },
  {
    date: '06.04.2020',
    title: 'Azi dimineața la 7!',
    content: `Mulți, și în aceste zile dificile, lucrează la linia de front. Ei fac tot posibilul pentru prevenirea epidemiei și ca starea de urgență șă fie suportabilă în orașul nostru. Respect și recunoștință lor și familiilor săi! Sandor Istvan Balogh, cu poza făcută azi dimineața la ora 7, a înregistrat două echipe de la serviciul de ambulanță din Salonta, în timpul schimbului. Nu apar cu toții în poză, dar știm că serviciul de ambulanță răspunde pentru aproximativ 60 mii de persoane, în Salonta și împrejurimi. Echipa lor este una dintre cei mai expuși pericolului în această luptă. Le mulțumim pentru sacrificii. Suntem mândri de ei!`,
  },
  {
    date: '06.04.2020',
    title: 'Ajutăm cetățenii!',
    content: `Rezervele financiare ale oamenilor se termină! Conducerea țării are nevoie să dezvolte urgent un plan economic și social. Ei trebuie să asigure condiții de viață decente! Cu legislația impusă, necorespunzătoare, din București și cu structura financiară incompletă, administrațiile locale nu pot rezolva în mod satisfăcător problemele sociale și economice care se dezvoltă din cauza epidemiei. Dar cu toate acestea, Salonta este alături de cetățeni!
Primarul Török László și doamna secretar general Patricia Ivanciuc au decis să înființeze un număr de telefon de urgență pentru persoanele care se confruntă cu probleme sociale! Astfel, specialiștii vor putea oferi informații utile și vor putea spune ce documentație este necesară pentru obținerea sprijinului. Numărul de telefon este: 0770659927. Acest dispozitiv are și aplicație WhatsApp. Ajutăm cetățenii!`,
  },
  {
    date: '03.04.2020',
    title: 'Dozatoare dezinfectante în blocuri',
    content: `Kis Annamária, șef serviciu economic al orașului, lucrează cu greu ca noi să putem achiziționa toate cele necesare în această perioadă. În cazul blocurilor, pe lângă dezinfectarea lor, conform ordonanței, ni se impune și montarea unor dozatoare în fiecare sacră de bloc. Totodată toată țara duce lipsă de aceste aparate, dar noi am reușit să achiziționăm prima parte din ele. Pe lângă faptul că primăria are foarte multe lucruri de făcut, datorită echipei persistente, zilele următoare sa va începe montarea primelor dozatoare de soluție dezinfectantă. Între timp putem continua cu dezinfectarea pe străzi, în spațiile publice și în jurul locuințelor private.`,
  },
  {
    date: '02.04.2020',
    title: 'ATENȚIE! Dezinfectare zona gării',
    content: `Mâine, vineri, 3 aprilie, vom dezinfecta scările blocurilor din zona gării. La nivelul orașului numărăm aproape 200 de blocuri care sunt și vor fi dezinfectate. Lucrările au început miercuri, 1 aprilie. În cele două zile trecute angajații primăriei au dezinfectat blocurile din centru, din piața Democrației, piața Târgului (lângă moară), blocul cu locuințe sociale și blocurile „energia".`,
  },
  {
    date: '02.04.2020',
    title: 'Ajutori în dezinfectare',
    content: `Ne face plăcere să cunoaștem din ce în ce mai mulți oameni buni, de ajutor. Antreprenorul Marius Cuibus s-a grăbit în ajutorul nostru, iar cu viceprimarul, Horváth János, au discutat în fața hărții orașului despre felul în care el și echipa lui ar putea ajuta la dezinfectarea blocurilor. Îi mulțumim lui și echipei pentru munca și ajutorul necondiționat, ei răspund pentru dezinfectarea blocurilor din zona gării. La fel îi mulțumim domnului Kajtor Sándor și nepotului său Kajtor Krisztián pentru ajutor. Ei s-au oferit să dezinfecteze spații publice din oraș. Zilele trecute am mai primit măsti, le mulțumim doamnelor Szabó Lucia, Tóth Ibolya și Varga Rákhel. Materialele necesare pentru protecție au fost deja împărțite între doritori.`,
  },
  {
    date: '01.04.2020',
    title: 'Dezinfectare!',
    content: `Primăria Salonta a început azi dezinfectarea în blocurile din centru. Echipa intră în toate blocurile, dezinfectează treptele, holurile și ușile de intrare cu soluție dezinfectantă pe bază de clor. Este o muncă enorm de mare dezinfectarea celor aproape 200 de blocuri, dar pe lângă dezinfectarea străzilor, primăria își asumă și această sarcină pentru menținerea și protecția sănătății cetățenilor.`,
  },
  {
    date: '01.04.2020',
    title: 'Stare civilă: măsuri luate în perioada stării de urgență',
    content: `În contextul instituirii stării de urgență pe teritoriul României, dată fiind publicarea in Monitorul Oficial Al Romăniei, Partea I, nr.212/16 martie 2020 a Decretului nr.195/2020.

Având in vedere evoluția infecțiilor cu noul CORONAVIRUS SARS COV 2 pe teritoriul Romăniei, precum și măsurile dispuse la nivel național pentru prevenirea infecției, in vederea limitării contactului direct, cu ocazia oficierii căsătoriei se va avea in vedere următoarele:

Declarațiile de căsătorie însoțite de documentele prevăzute de lege se vor transmite exclusiv on-line pe adresa de email a serviciului public comunitar local de evidență a persoanelor, starea civilă, competent să oficieze căsătoria numai urmare a programării on-line/telefonice a datei și orei încheierii căsătoriei.

Numărul persoanelor admise la oficierea căsătorie este: 8.
Adresa email: seipsalonta@gmail.com, telefon 0359409730.`,
  },
  {
    date: '31.03.2020',
    title: 'Important: miercuri la blocul cu 7 etaje!',
    content: `Mâine, miercuri dimineața va începe, conform Ordonanței Militare, dezinfectarea scărilor în blocuri. La nivel de oraș, numărul blocurilor de care răspunde Primăria Salonta este aproape de 200. Pe lângă ocupațiile actuale, acesta este un efort în plus pentru angajații primăriei, dar facem tot posibilul pentru sănătatea cetățenilor. Miercuri, întâi aprilie, dezinfectăm holurile clădirilor din curtea blocului cu 7 etaje; deci blocurile amplasate pe partea de nord a străzii principale. Lucrările continuă și joi. Să avem grijă unii de alții!`,
  },
  {
    date: '31.03.2020',
    title: 'Ședință obișnuită – Condiții neobișnuite!',
    content: `Din cauza epidemiei, consiliul local și-a ținut ședința azi în sala mare a Casei de cultură. Între punctele la ordinea zilei s-au enumerat multe decizii importante. Pe lângă altele, au modificat regulile de funcționare a Consiliului Local, conform căruia de acum înainte ședințele se vor putea desfășura și online sau prin conferință telefonică. Au luat decizii și în multe alte întrebări: au alocat bani pentru tratarea și eliminarea problemelor cauzate de coronavirus.`,
  },
  {
    date: '31.03.2020',
    title: 'Cumpărarea medicamentelor',
    content: `Persoanele care suferă de boli cronice trebuie să-și cumpere medicamnetele în fiecare lună, dat totodată exact ei sunt cei care ar trebui să respecte cel mai strict izolarea la domiciliu, n-ar trebui să-și părăsească locuințele deloc. Asistenta Osvath Andrea, specialistă în domeniu, le va ajuta pe ei, ca să nu fie nevoiți să se deplaseze la cabinetele medicale sau la farmacii.

Pașii cumpărării medicamentelor:
1. Cereți programare de la medicul de familie.
2. Cu două zile înainte de data programată sunați la primărie la unul din următoarele: 0755328388, 0359409730, 0359409731, solicitând ajutorul pentru cumpărarea medicamentelor.
3. Colega noastră, Osváth Andrea, asistentă medicală, vă va vizita, va prelua cardul de sănătate și va discuta cu dvs. despre medicamente.
4. La data stabilită prin programare, asistenta va merge la cabinetul medical, va prelua rețeta, va cumpăra medicamentele de la farmacie și le va livra la domiciliu.

Ajutorul este gratuit, trebuie achitat doar contravaloarea medicamentelor, pe baza bonului fiscal.`,
  },
  {
    date: '30.03.2020',
    title: 'Misiune nouă: dezinfectarea a 200 de blocuri!',
    content: `În urmă cu 2 săptămâni i-am rugat pe responsabilii asociațiilor de locuitori să dezinfecteze scările blocurilor. Pe lângă aceasta, ordonanța militară numărul 4 prevede transferarea acestei sarcini către Primăria Salonta. Va fi o muncă foarte mare, deoarece și conform calculelor de aproximație, specialiștii Primăriei trebuie să dezinfecteze cel puțin 200 de scări.`,
  },
  {
    date: '30.03.2020',
    title: 'Salonta necontaminată!',
    content: `Momentan nu este nicio persoană infectată în orașul nostru! Să ne rugăm la bunul Dumnezeu ca aceasta să rămână neschimbată. Este foarte important să respectăm măsurile de prevenție și regulile situației de urgență!`,
  },
  {
    date: '27.03.2020',
    title: 'Echipa primăriei lucrează!',
    content: `Azi e a doua zi de când angajații Primăriei Salonta și echipa de voluntari au pornit pe drum să viziteze toate persoanele vârstnice din oraș. Scopul este contactarea tuturor persoanelor care sunt singuri, nu pot conta pe ajutorul rudelor sau a vecinilor pe perioada situației de urgență. În decursul acestor două zile au ajuns la mai mult de 1000 de locuințe. Le mulțumim pentru munca necondiționată! Totodată observăm cu mare bucurie faptul că din ce în ce mai mulți voluntari ne oferă servicii și ajutor, le mulțumim și lor!`,
  },
  {
    date: '27.03.2020',
    title: 'Vă ajutăm la ieșirea din casă!',
    content: `Cu toții ȘTIM că, pentru a părăsi locuința, pe durata situației de urgență, trebuie să avem la noi tot timpul declarație pe propria răspundere. DAR sunt persoane care nu au posibilitatea să printeze formularul ori nu au smatphone sau tabletă. PRIMĂRIA SALONTA vă vine din nou la ajutor! Azi, începând cu ora 10, împărțim în toate magazinele alimentare mai mari, câte 30 de formulare printate, și cu acesta ajutând cetățenii din Salonta. Acestea vor putea fi ridicate de la casele de marcat. Să trecem cu bine peste această situație!`,
  },
  {
    date: '26.03.2020',
    title: 'Echipa este pe drum!',
    content: `Am început în 17 martie! Acum se ridică la un nivel nou sistemul de ajutor, realizat la începutul săptămânii trecute. În aceste minute voluntarii și angajații primăriei vizitează 3800 de persoane în vârstă, care au împlinit 65 de ani, să vadă cine are nevoie de ajutor. Le mulțumim pentru munca necondiționată! Să fim uniți!`,
  },
  {
    date: '26.03.2020',
    title: 'S-a deschis trecerea de frontieră de lângă Salonta!',
    content: `Aducem la cunoștința cetățenilor deschiderea trecerii de frontieră de lângă Salonta strict pentru navetiști. Persoanele care locuiesc în interiorul razei de 30 de km față de graniță și lucrează în interiorul unei raze de 30 km pe partea cealaltă a graniței, de azi pot trece și la vama Salonta – Micherechi. Probabil vor avea permisiune de trecere și persoanele care fac demersuri oficiale – dovedite cu acte oficiale – în aceeași rază de 30+30 km. Pentru mai multe informații consultați pagina Poliției de Frontieră!`,
  },
  {
    date: '25.03.2020',
    title: 'Vizităm 3800 de persoane vârstnice!',
    content: `O muncă enorm de mare! Joi dimineața vor porni 16 persoane să le ofere ajutor persoanelor vârstnice. Vom vizita 3800 de bătrâni și acei copii care sunt crescuți de bunicii lor. Vă rugăm să distribuiți această postare, să afle cât mai mulți de sosirea grupului de ajutor.

ATENȚIE! Comercianții (proprietarii de magazine alimentare / restaurante) care au posibilitate de livrare la domiciliu sunt rugați să ne contacteze în mesaj privat în cursul zilei de azi. Toate persoanele vârstnice vor primi o listă cu numerele de telefon pentru urgențe și cu contactele comercianților. Le mulțumim colegilor, că ne sunt alături și ne ajută și în această perioadă dificilă.`,
  },
  {
    date: '24.03.2020',
    title: 'Ordonanța militară nr. 3',
    content: `MAI a emis Ordonanța militară nr 3 privind măsuri de prevenire a răspândirii Covid-19

Articolul 1. Se interzirce circulația tuturor persoanelor, cu următoarele excepții: deplasarea în interes profesional, asigurarea de bunuri pentru necesitățile de bază ale persoanelor și animalelor domestice, asistență medicală care nu poate fi amânată, îngrijire copil, asistență persoane vârstnice, deplasări scurte pentru activitate fizică, dar sunt excluse toate activitățile de echipă, cum ar fi fotbalul, donarea de sânge.

Articolul 2. Deplasarea persoanelor de peste 65 de ani este permisă între orele 11 – 13, pentru scopurile de mai sus.

Articolul 3. Circulația persoanelor prevăzute la articolul 2 este permisă și în afara intervalului de timp 11.00 – 13.00 dacă se face în interes profesional sau activități agricole.

Articolul 4. Aceste persoane trebuie să prezinte o declarație pe proprie răspundere.

Articolul 7. Instituțiile publice și operatorii economici trebuie să marcheze zona de acces a publicului cu semne vizibile care să asigure o distanță de minim 1,5 m.

Articolul 12. Documentele care expiră pe perioada stării de urgență pot fi scimbate într-un termen de 90 de zile de la încetarea stării de urgență.

Această măsură se aplică începând de miercuri, 25 martie.`,
  },
  {
    date: '24.03.2020',
    title: 'Credem în viitor!',
    content: `Credem că vom trece cu bine peste săptămânile acestea triste și grele, de aceea lucrăm în fiecare zi. În aceste ore, colegii noștrii, în vremea urâtă, plantează trandafiri în parcul Nuca de aur. Suportul de fier este cel reutilizat din parcul central. Conform planurilor noastre, parcul de joacă Nuca de aur va fi inaugurată înainte de sărbătorile de Paști, spre bucuria locuitorilor din zonă. Ne dă multă putere credința în Salonta și credința în viitor!`,
  },
  {
    date: '24.03.2020',
    title: 'ATENȚIE!!! Carantină totală!',
    content: `Începând de miercuri carantină totală în România!
IMPORTANT! Persoanelor cu vârsta de peste 65 de ani le este interzis să iasă pe stradă!

Ordonanța intrată în vigoare luni, a impus reglementări legate de carantină obligarorie pe timpul nopții, și recomandarea lor pe timpul zilei. Președintele României, azi la amiază a declarat: de mâine carantina este obligatorie pe toată durata zilei!

ÎN CELE 24 ORE ALE ZILEI DOMICILIUL SE POATE PĂRĂSI DOAR ÎN URMĂTOARELE CAZURI:
– în interes profesional (dacă nu poate lucra de acasă)
– cumpărarea celor necesare, urgențe medicale, în ajutorul copiilor, vârstnicilor șau a bolnavilor, decese din familie, plimbări scurte aproape de locuință.

În afara locuinței, cetățenii pot circula doar respectând reglementările legate de covid-19, este interzisă adunarea în grupuri de orice fel. Prin grup se înțelege adunarea a mai mult de 3 persoane în același loc, care nu aparțin de aceeași locuință.`,
  },
  {
    date: '24.03.2020',
    title: 'Mulțumiri echipei Primăriei!',
    content: `Zilele acestea mulți se confruntă cu diferite greutăți și probleme, ca noi cetățenii să resimțim cât mai puțin din această situație. Respect și mulțumiri tuturor pentru toate acestea. Le mulțumim echipei Primăriei Municipiului Salonta pentru devotament și profesionism!`,
  },
  {
    date: '24.03.2020',
    title: 'Reglementări la biroul de evidență a persoanelor!',
    content: `Conform legii în vigoare, în perioada stării de urgență, durata de valabilitate a tuturor documentelor personale va fi prelungită automat (rămân valabile până la sfârșitul stării de urgență), astfel, biroul de evidență a persoanelor (buletine) de la Primăria Salonta introduce noi reglementări.

Carte de identitate (buletin) se eliberează doar persoanelor care:
1.) în perioada următoare vor împlini vârsta de 14 ani,
2.) au pierdut cartea de identitate și trebuie s-o refacă.

Atenție: pentru programări sunați la 0755328388, 0359409730 sau 0359409731. Persoanele care și-au făcut deja programare zilele trecute, acelea rămân valabile.`,
  },
  {
    date: '23.03.2020',
    title: 'Mulțumiri Spitalului Teritorial Salonta!',
    content: `Zilele acestea mulți se confruntă cu diferite greutăți și probleme, ca noi cetățenii să resimțim cât mai puțin din această situație. Respect și mulțumiri tuturor pentru toate acestea. Le mulțumim echipei Spitalului Teritorial Salonta pentru devotament și profesionism!`,
  },
  {
    date: '23.03.2020',
    title: 'Salontani minunați!',
    content: `Azi am avut parte de o surpiză plăcută! Ne-a vizitat maestrul croitor Hízó Sándor cine, cu colegul și totodată prietenul lui Gergely István sâmbătă, sacrificându-și toată ziua, ne-au croit măști din materialul propriu, pe gratis, fără contracost. Imediat după ce am preluat cele 50 de măsți, a apărut încă un ajutor salontan, Tóth Ibolya, cine ne-a adus încă un set de măști. Multe mulțumiri și respect pentru munca necondiționată. Faptele lor ne poate da putere: încă trăiește solidaritatea în oameni! Măștile vor fi sterilizate și vor fi împărțite între persoanele care au nevoie de ele și care le solicită prin mesaj privat!`,
  },
  {
    date: '23.03.2020',
    title: 'Susținem producătorii locali!',
    content: `Conform deciziilor Comisiei de Urgență Salonta, piața agroalimentară rămâne închisă. Dorim să susținem și să oferim ajutor producătorilor locali, astfel am pregătit o listă, apelați la ei cu încredere.

Dani Zsolt – 0746567092 – lapte
Hegedűs Zoltán – 0727949960 – lapte de capră
Ilyés Ferenc – 0747228501 – ouă
Márkus Imre és Zsuzsanna – 0770120162 / 0755092405 – frunză de pătrunjel, frunză de mărar, spanac
Lezeu Cristian – 0746077848 – ridichi, ceapă verde, frunză de mărar, frunză de pătrunjel
Kertmegi Enikő és Zsolt – 0766-465-961 – salată, spanac
Mónus Zsuzsanna – 0721 629 069 – boia, cale la fir
Moldován Ágnes – 0770821217 – panseluțe și alte flori în ghiveci
Kádár Dalma – 0736390352 – plante ornamentale de grădină
Varga Róbert – 0770820218 – cale la fir
Bajó Ferencz – 0753196376 – cartofi`,
  },
  {
    date: '20.03.2020',
    title: 'Apel în caz de urgență: 0758225678',
    content: `Primarul Török László i-a transmis miercuri șefului poliției Călin Moș comisar șef: este intolerabilă prezența în oraș a sătenilor care nu demult s-au întors din străinătate unde trăiau din cerșit. A cerut abordarea cât mai rapidă a problemei, fapt efectuat de șeful poliției.

Cetățenii din Salonta pot observa oameni care, după ce au ajuns acasă din străinătate nu au intrat în izolare la domiciliu sau persoane care trăiesc în aceeasi casă cu ei și mai umblă la lucru sau în public. Poliția Locală dublează, începând de luni, numărul echipelor care supraveghează centrul orașului.

Dacă cineva știe de vreun caz care nu respectă prevederile legale a situației de urgență, este rugat să apeleze la poliție la numărul: 0758-225-678.`,
  },
];

const COVID_DOCUMENTS = [
  { title: 'Declarație pe proprie răspundere', url: '#' },
  { title: 'Ordonanța militară nr. 3', url: '#' },
  { title: 'Măsuri stare civilă', url: '#' },
];

export default function CoronavirusPage() {
  const t = useTranslations('navigation');
  const tc = useTranslations('coronavirusPage');

  return (
    <>
      <Breadcrumbs items={[
        { label: t('informatiiPublice'), href: '/informatii-publice' },
        { label: tc('title') }
      ]} />
      <PageHeader titleKey="coronavirus" icon="alertTriangle" />

      <Section background="white">
        <Container>
          <div className="max-w-4xl mx-auto">
            
            {/* Archive notice */}
            <Card className="mb-8 bg-amber-50 border-amber-200">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 mb-1">{tc('archiveTitle')}</h2>
                    <p className="text-sm text-gray-700">{tc('archiveText')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Documents section */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  {tc('documentsTitle')}
                </h2>
                <div className="space-y-2">
                  {COVID_DOCUMENTS.map((doc, i) => (
                    <div 
                      key={i}
                      className="flex items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700">{doc.title}</span>
                      </div>
                      <Link
                        href={doc.url}
                        className="flex items-center gap-1 px-2 py-1 bg-gray-200 text-gray-700 hover:bg-gray-300 rounded text-xs font-medium shrink-0"
                      >
                        <Download className="w-3 h-3" />
                        PDF
                      </Link>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Updates timeline */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Info className="w-5 h-5 text-orange-600" />
                {tc('updatesTitle')}
              </h2>
              <div className="space-y-4">
                {COVID_UPDATES.map((update, index) => (
                  <Card key={index} className="overflow-hidden border-l-4 border-l-orange-400">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <Calendar className="w-4 h-4" />
                        {update.date}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{update.title}</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-line">{update.content}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* More info */}
            <Card className="mt-8 bg-gray-50">
              <CardContent className="p-5">
                <div className="flex gap-4">
                  <Info className="w-5 h-5 text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">{tc('moreInfo')}</p>
                    <Link 
                      href="/contact" 
                      className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {tc('contactLink')} →
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

          </div>
        </Container>
      </Section>
    </>
  );
}
