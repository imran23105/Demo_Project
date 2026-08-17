// ─────────────────────────────────────────────
// BRITA FOOTWEARS – 1200+ Customers Mock Data
// ─────────────────────────────────────────────
const firstNames = ["Aryan","Priya","Rahul","Sneha","Vikram","Pooja","Amit","Kavya","Raj","Ananya","Dev","Ishaan","Neha","Karan","Riya","Siddharth","Aisha","Rohan","Megha","Aditya","Divya","Nikhil","Shreya","Abhishek","Tanvi","Mihir","Kritika","Varun","Pallavi","Shubham","Akash","Swati","Harsh","Manisha","Deepak","Sunita","Gaurav","Rekha","Kunal","Smita","Ankur","Preeti","Vivek","Seema","Tarun","Anita","Suresh","Geeta","Rakesh","Meena","Ashish","Lata","Dhruv","Heena","Saurabh","Sheela","Kiran","Vandana","Tushar","Rina","Yash","Uma","Mohit","Sonal","Neeraj","Jaya","Pankaj","Nandini","Vikas","Leela","Hemant","Sarita","Bhushan","Archana","Ajay","Mamta","Akhil","Sudha","Rishabh","Sujata","Prateek","Kamala","Chetan","Savita","Mayur","Usha","Parag","Radha","Vipul","Gita","Sachin","Kalavati","Nilesh","Sumitra","Girish","Nalini","Mahesh","Vimala","Dinesh","Parvati"];
const lastNames = ["Sharma","Patel","Kumar","Singh","Gupta","Verma","Mehta","Shah","Joshi","Nair","Reddy","Bose","Das","Iyer","Pillai","Agarwal","Mishra","Yadav","Tiwari","Pandey","Trivedi","Desai","Chopra","Malhotra","Saxena","Srivastava","Dwivedi","Tripathi","Shukla","Kapoor","Chauhan","Rajput","Thakur","Chaudhary","Sinha","Bansal","Goel","Sethi","Nanda","Bahl"];
const cities = ["Mumbai","Delhi","Bangalore","Hyderabad","Chennai","Kolkata","Pune","Ahmedabad","Jaipur","Lucknow","Surat","Nagpur","Indore","Bhopal","Coimbatore","Visakhapatnam","Kanpur","Patna","Vadodara","Ludhiana","Agra","Nashik","Faridabad","Meerut","Rajkot","Varanasi","Srinagar","Aurangabad","Dhanbad","Amritsar"];

function getRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randomBetween(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateCustomer(id) {
  const firstName = getRandom(firstNames);
  const lastName = getRandom(lastNames);
  const orders = randomBetween(0, 24);
  const totalSpent = orders * randomBetween(799, 5999);
  const daysAgo = randomBetween(1, 730);
  const isActive = Math.random() > 0.15;

  return {
    id,
    name: `${firstName} ${lastName}`,
    email: `${firstName.toLowerCase()}${randomBetween(1, 999)}@${getRandom(["gmail","yahoo","hotmail","outlook"])}.com`,
    phone: `+91 ${randomBetween(7000000000, 9999999999)}`,
    city: getRandom(cities),
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${id}`,
    orders,
    totalSpent,
    lastPurchase: new Date(Date.now() - daysAgo * 86400000).toISOString(),
    status: isActive ? "Active" : "Inactive",
    joinedAt: new Date(Date.now() - randomBetween(daysAgo, 730) * 86400000).toISOString(),
    addresses: [
      {
        id: 1,
        label: "Home",
        line: `${randomBetween(1,999)}, ${getRandom(["MG Road","Park Street","Nehru Nagar","Gandhi Colony","Civil Lines"])}`,
        city: getRandom(cities),
        state: getRandom(["Maharashtra","Delhi","Karnataka","Telangana","Tamil Nadu","Gujarat"]),
        pincode: `${randomBetween(100000, 999999)}`,
        isDefault: true,
      }
    ],
    wishlistCount: randomBetween(0, 15),
  };
}

export const customers = Array.from({ length: 1200 }, (_, i) => generateCustomer(i + 1));
export default customers;
