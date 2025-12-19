import { useState } from "react";
import { CreditCard, Search, Link2, Building2 } from "lucide-react";
import { SearchCard, SearchCardHeader, SearchCardContent } from "../components/SearchCard";
import ResultsDisplay from "../components/ResultsDisplay";
import { toast } from "sonner";
import axios from "axios";
const API_KEY = "C4484B7E-65B9-43AB-8F82-5B97E375AE4D"
const GSTByPAN = () => {
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validatePAN = (pan) => {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return panRegex.test(pan.toUpperCase());
  };

  const handleSearch = async () => {
    if (!panNumber.trim()) {
      toast.error("Please enter a PAN number");
      return;
    }

    if (!validatePAN(panNumber)) {
      toast.error("Invalid PAN format. Example: ABCDE1234F");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);
try {
    // STEP 1: Search by PAN to get the list of GSTINs
    const panResponse = await axios.post(
      "/vlink-api/SearchByPan",
      { PanNumber: panNumber.toUpperCase() },
      { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
    );

    if (panResponse.data?.status === "success") {
      const gstinList = panResponse.data.data.GstinResList; // The array of GSTs
      const panNum = panResponse.data.data.PanNum;

      // STEP 2: Create a list of promises to fetch details for EVERY GSTIN found
      const detailsPromises = gstinList.map((item) => 
        axios.post(
          "/vlink-api/SearchByGst",
          { GstNumber: item.Gstin },
          { headers: { "x-api-key": API_KEY, "Content-Type": "application/json" } }
        )
      );

      // STEP 3: Run all GST searches in parallel
      const allGstResponses = await Promise.all(detailsPromises);

      // STEP 4: Format and map the data into your required structure
      const formattedGstDetails = allGstResponses.map((res) => {
        const d = res.data.data; // The actual business data from SearchByGST
        
        // Helper to extract state name (same as before)
        const stateName = d.stj?.match(/State - (.*?),/)?.[1] || "N/A";

        return {
          gstin: d.gstin,
          trade_name: d.tradeNam || "N/A",
          legal_name: d.lgnm || "N/A",
          status: d.sts || "N/A",
          state: stateName,
          registration_date: d.rgdt || "N/A",
        };
      });

      // STEP 5: Update the final state
      setResults({
        pan_number: panNum.toUpperCase(),
        total_gst_linked: gstinList.length,
        gst_details: formattedGstDetails,
      });

      toast.success(`Found ${gstinList.length} GST registration(s)`);
    } else {
      toast.error("No data found for this PAN");
    }
  } catch (err) {
    console.error("PAN Search Error:", err);
    setError("Failed to fetch data for this PAN");
    setLoading(false);
    toast.error("Error connecting to API");
  } 
    // Simulating API call for GST linked with PAN
    // setTimeout(() => {
    //   setResults({
    //     pan_number: panNumber.toUpperCase(),
    //     total_gst_linked: 2,
    //     gst_details: [
    //       {
    //         gstin: "27ABCDE1234F1Z5",
    //         trade_name: "ABC Enterprises",
    //         legal_name: "ABC Private Limited",
    //         status: "Active",
    //         state: "Maharashtra",
    //         registration_date: "2018-07-01",
    //       },
    //       {
    //         gstin: "29ABCDE1234F2Z3",
    //         trade_name: "ABC Trading Co",
    //         legal_name: "ABC Private Limited",
    //         status: "Active",
    //         state: "Karnataka",
    //         registration_date: "2019-03-15",
    //       },
    //     ],
    //   });
    //   setLoading(false);
    //   toast.success("GST details linked to PAN retrieved successfully!");
    // }, 1500);
  };

  const renderGSTResults = () => {
    if (!results) return null;

    return (
      <div className="p-6 space-y-6">
        {/* Summary */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 border border-primary/20">
          <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
            <Link2 className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">PAN Number</p>
            <p className="font-bold text-lg text-foreground">{results.pan_number}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">Total GST Linked</p>
            <p className="font-bold text-2xl text-primary">{results.total_gst_linked}</p>
          </div>
        </div>

        {/* GST List */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground flex items-center gap-2">
            <Building2 className="w-5 h-5 text-primary" />
            Linked GST Registrations
          </h3>
          {results.gst_details.map((gst, index) => (
            <div
              key={gst.gstin}
              className="p-4 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-mono text-sm text-primary font-medium">{gst.gstin}</p>
                  <p className="font-semibold text-foreground mt-1">{gst.trade_name}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    gst.status === "Active"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}
                >
                  {gst.status}
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Legal Name</p>
                  <p className="text-foreground">{gst.legal_name}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">State</p>
                  <p className="text-foreground">{gst.state}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Registration Date</p>
                  <p className="text-foreground">{gst.registration_date}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">GST by PAN Search</h1>
        <p className="text-muted-foreground mt-2">
          Find all GST registrations linked to a PAN number
        </p>
      </div>

      {/* Search Card */}
      <SearchCard>
        <SearchCardHeader
          icon={Search}
          title="Search GST by PAN"
          description="Enter PAN to find all linked GST registrations"
        />
        <SearchCardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                PAN Number
              </label>
              <input
                type="text"
                value={panNumber}
                onChange={(e) => setPanNumber(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="w-full py-3 px-6 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Search size={18} />
              {loading ? "Searching..." : "Search GST Linked to PAN"}
            </button>
          </div>
        </SearchCardContent>
      </SearchCard>

      {/* Results */}
      <SearchCard className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <SearchCardHeader
          icon={Link2}
          title="Linked GST Results"
          description="GST registrations linked to the PAN will appear here"
        />
        {loading && (
          <div className="p-12 text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Fetching linked GST details...</p>
          </div>
        )}
        {error && (
          <div className="p-6">
            <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          </div>
        )}
        {results && renderGSTResults()}
        {!results && !loading && !error && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Link2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter a PAN number to find linked GST registrations
            </p>
          </div>
        )}
      </SearchCard>
    </div>
  );
};

export default GSTByPAN;
