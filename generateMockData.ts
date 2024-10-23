import { createClient } from "@supabase/supabase-js";
import { faker } from "@faker-js/faker";
import type { Database } from "./src/types/supabase";

// Stellen Sie sicher, dass Sie diese Werte durch Ihre tatsächlichen Supabase-Credentials ersetzen
const supabaseUrl = "https://aoqilsqgvuuvmnsccgvx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcWlsc3FndnV1dm1uc2NjZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNzc3NTIsImV4cCI6MjA0NDc1Mzc1Mn0.WYfFh0sQD1COSZ1Tckd21fkive1CBfsWhgc86QIdrGQ";
if (!supabaseUrl) throw new Error("Missing env.VITE_SUPABASE_URL");
if (!supabaseAnonKey) throw new Error("Missing env.VITE_SUPABASE_ANON_KEY");

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  const { data, error } = await supabase.from("users").select("id").limit(1);
  if (error) {
    console.error("Connection error:", error);
    return false;
  }
  console.log("Connection successful", data);
  return true;
}

async function getTherapistId(providedId?: string): Promise<string> {
  if (providedId) {
    const { data, error } = await supabase
      .from("users")
      .select("id")
      .eq("id", providedId)
      .single();

    if (error || !data) {
      console.error(
        "Provided therapist ID not found. Falling back to first available user.",
      );
    } else {
      return providedId;
    }
  }

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .limit(1)
    .single();

  if (error || !data) {
    throw new Error("No users found in the database");
  }

  return data.id;
}

async function generateUniqueEmail(): Promise<string> {
  let isUnique = false;
  let email = "";

  while (!isUnique) {
    email = faker.internet.email();
    const { data, error } = await supabase
      .from("clients")
      .select("email")
      .eq("email", email);

    if (error) {
      console.error("Error checking email uniqueness:", error);
      throw error;
    }

    isUnique = data.length === 0;
  }

  return email;
}

async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });
  if (error) throw error;
  return data;
}

async function generateMockClients(count: number, therapistId: string) {
  for (let i = 0; i < count; i++) {
    const client = {
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: await generateUniqueEmail(),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      therapist_id: therapistId,
    };

    const { error } = await supabase.from("clients").insert([client]);

    if (error) {
      console.error("Error inserting client:", error);
    } else {
      console.log(`Inserted client ${i + 1}/${count}`);
    }
  }
}

async function main() {
  try {
    // Anmelden als authentifizierter Benutzer
    await signIn("sascha.kohler@sent.at", "123456");

    const args = process.argv.slice(2);
    const count = parseInt(args[0]) || 20;

    // Hier nehmen wir an, dass auth.uid() den therapist_id entspricht:
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("Not authenticated");

    const therapistId = user.id;
    console.log(`Using therapist ID: ${therapistId}`);
    console.log(`Generating ${count} mock clients`);

    await generateMockClients(count, therapistId);
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

main();
