import bcrypt from 'bcryptjs';
const data = {
    users: [
        {
            name: 'Marton',
            email: 'admin@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: true,
        },
        {
            name: 'John',
            email: 'user@example.com',
            password: bcrypt.hashSync('123456'),
            isAdmin: false,
        },
    ],
    products: [
        {
            //_id: '1',
            name: 'HEAD WORLDCUP REBELS E-SPEED PRO FF14 22-23',
            slug: 'head-silec',
            category: 'Silec',
            image: '/img/p1.jpg',
            ar: '75',
            countInStock: '10',
            brand: 'Head',
            rating: 3,
            numReviews: 10,
            description: 'Model, ktorý oslovuje TOP lyžiarov, preferujúcich stredne dlhé až dlhé oblúky vo vysokom spektre rýchlosti predovšetkým na upravených zjazdovkách. Relatívne vysoká flexia náročná na silu ovládania, na druhej strane excelentný grip a stabilita v rýchlosti. S viazaním FreeFlex 14 na FIS podložke RACE PLATE WRC14 a dokonale  pripravenou sklznicou sa tento model blíži prefekárskym FIS verziam.'
        },
        {
            //_id: '2',
            name: 'Fischer silec',
            slug: 'fischer-silec',
            category: 'Silec',
            image: '/img/p2.jpg',
            ar: '50',
            countInStock: '10',
            brand: 'Fischer',
            rating: 2.7,
            numReviews: 4,
            description: 'kozepes minosegu silec'
        },
        {
            //_id: '3',
            name: 'Lyžiarky Head Nexo LYT 110 RS Anthracite/Red 21/22 MP',
            slug: 'head-cipo',
            category: 'Cipo',
            image: '/img/p3.jpg',
            ar: '25',
            countInStock: '10',
            brand: 'Head',
            rating: 4.1,
            numReviews: 5,
            description: 'Férfi sícipő haladó és középhaladó síelők részére. Flex Index: 110. Szélesség: 102 mm. Perfect fit: melegítéssel lábra formázható bélés. Form Fit: a külső héj is formázható melegítéssel. Grip Walk technológia: Csúszásmentes anyag, Természetes gyalogló mozgást eredményez. Jobb gördülési tulajdonság. Szebb ívben tud meghajolni a síléc a cipő alatt. 40 mm széles tépőzár. 4 micro állítású fém csat. 1 supermacro csat. Double canting - a szár jobbra, illetve balra dőlés - állítás.\n' +
                'Az új GRAPHENE héj szerkezet egyensúlyt teremt teljesítmény, komfort és a könnyű súlyú héjszerkezet közt. Az új intelligens héj kiváló erőátvitelt biztosít dinamikus, progresszív sízés közben.'
        },
        {
           // _id: '4',
            name: 'Fischer cipo',
            slug: 'fischer-cipo',
            category: 'Silec',
            image: '/img/p4.jpg',
            ar: '15',
            countInStock: '10',
            brand: 'Fischer',
            rating: 5.0,
            numReviews: 1,
            description: 'kozepes minosegu cipo'
        }
    ]
}
export default data;