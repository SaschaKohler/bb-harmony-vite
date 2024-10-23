"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var supabase_js_1 = require("@supabase/supabase-js");
var faker_1 = require("@faker-js/faker");
// Stellen Sie sicher, dass Sie diese Werte durch Ihre tatsächlichen Supabase-Credentials ersetzen
var supabaseUrl = "https://aoqilsqgvuuvmnsccgvx.supabase.co";
var supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvcWlsc3FndnV1dm1uc2NjZ3Z4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkxNzc3NTIsImV4cCI6MjA0NDc1Mzc1Mn0.WYfFh0sQD1COSZ1Tckd21fkive1CBfsWhgc86QIdrGQ";
if (!supabaseUrl)
    throw new Error("Missing env.VITE_SUPABASE_URL");
if (!supabaseAnonKey)
    throw new Error("Missing env.VITE_SUPABASE_ANON_KEY");
var supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
function getTherapistId(providedId) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, data_1, error_1, _b, data, error;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!providedId) return [3 /*break*/, 2];
                    return [4 /*yield*/, supabase
                            .from("users")
                            .select("id")
                            .eq("id", providedId)
                            .single()];
                case 1:
                    _a = _c.sent(), data_1 = _a.data, error_1 = _a.error;
                    if (error_1 || !data_1) {
                        console.error("Provided therapist ID not found. Falling back to first available user.");
                    }
                    else {
                        return [2 /*return*/, providedId];
                    }
                    _c.label = 2;
                case 2: return [4 /*yield*/, supabase
                        .from("users")
                        .select("id")
                        .limit(1)
                        .single()];
                case 3:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (error || !data) {
                        throw new Error("No users found in the database");
                    }
                    return [2 /*return*/, data.id];
            }
        });
    });
}
function generateUniqueEmail() {
    return __awaiter(this, void 0, void 0, function () {
        var isUnique, email, _a, data, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    isUnique = false;
                    email = "";
                    _b.label = 1;
                case 1:
                    if (!!isUnique) return [3 /*break*/, 3];
                    email = faker_1.faker.internet.email();
                    return [4 /*yield*/, supabase
                            .from("clients")
                            .select("email")
                            .eq("email", email)];
                case 2:
                    _a = _b.sent(), data = _a.data, error = _a.error;
                    if (error) {
                        console.error("Error checking email uniqueness:", error);
                        throw error;
                    }
                    isUnique = data.length === 0;
                    return [3 /*break*/, 1];
                case 3: return [2 /*return*/, email];
            }
        });
    });
}
function generateMockClients(count, therapistId) {
    return __awaiter(this, void 0, void 0, function () {
        var i, client, error;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    i = 0;
                    _b.label = 1;
                case 1:
                    if (!(i < count)) return [3 /*break*/, 5];
                    _a = {
                        first_name: faker_1.faker.person.firstName(),
                        last_name: faker_1.faker.person.lastName()
                    };
                    return [4 /*yield*/, generateUniqueEmail()];
                case 2:
                    client = (_a.email = _b.sent(),
                        _a.phone = faker_1.faker.phone.number(),
                        _a.address = faker_1.faker.location.streetAddress(),
                        _a.therapist_id = therapistId,
                        _a);
                    return [4 /*yield*/, supabase.from("clients").insert([client])];
                case 3:
                    error = (_b.sent()).error;
                    if (error) {
                        console.error("Error inserting client:", error);
                    }
                    else {
                        console.log("Inserted client ".concat(i + 1, "/").concat(count));
                    }
                    _b.label = 4;
                case 4:
                    i++;
                    return [3 /*break*/, 1];
                case 5:
                    console.log("Successfully inserted ".concat(count, " mock clients"));
                    return [2 /*return*/];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var args, providedTherapistId, count, therapistId, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    args = process.argv.slice(2);
                    providedTherapistId = args[0];
                    count = parseInt(args[1]) || 10;
                    return [4 /*yield*/, getTherapistId(providedTherapistId)];
                case 1:
                    therapistId = _a.sent();
                    console.log("Using therapist ID: ".concat(therapistId));
                    return [4 /*yield*/, generateMockClients(count, therapistId)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    console.error("An error occurred:", error_2);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
main();
