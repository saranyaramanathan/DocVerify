import { useState,useEffect} from "react";
import { Building2, Search, MapPin, Calendar } from "lucide-react";
import { SearchCard, SearchCardHeader, SearchCardContent } from "../components/SearchCard";
import ImageUploader from "../components/ImageUploader";
import ResultsDisplay from "../components/ResultsDisplay";
import { toast } from "sonner";
import axios from "axios";
const API_KEY = "C4484B7E-65B9-43AB-8F82-5B97E375AE4D"
const GSTSearch = () => {
  const [gstNumber, setGstNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const validateGST = (gst) => {
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return gstRegex.test(gst.toUpperCase());
  };
 const searchByGST = async () => {
      try {
       const { data } = await axios.post(
          "https://sandbox.vlinknow.com//api/SearchByPAN",
          {
            //GstNumber:"37AGIPR4537M1ZQ"
            "PanNumber": "AISPI5131Q"
          },
          {
            headers: { "x-api-key":API_KEY,"Content-Type": "application/json" },
            
          }
        );
        console.log("test data...",data)
        // Inside searchByGST, after a successful axios.post call:

if (data && data.status === "success" && data.data) {
    
    const responseData = data.data; 
    const getStateName = (stjString) => {
        const match = stjString.match(/State - (.*?),/);
        return match ? match[1].trim() : 'N/A';
    };

    setResults({
        
        gstin: responseData.gstin || gstToSearch.toUpperCase(),
        legal_name: responseData.lgnm || 'N/A',
        trade_name: responseData.tradeNam || 'N/A',
        registration_date: responseData.rgdt || 'N/A',
        status: responseData.sts || 'N/A',
        business_type: responseData.ctb || 'N/A',
        state: getStateName(responseData.stj || ''), 
        principal_place: responseData.pradr?.adr || 'N/A', 
        additional_places: responseData.adadr ? "Yes" : "No", 
      
    });
    
    toast.success("GST details retrieved successfully!");

} else if (data && data.status === "error") {
    setError(data.message || "GST details not found.");
    toast.error(`Search failed: ${data.message || "Unknown error"}`);
} else {
  
    setError("GST details not found or API returned an unexpected response.");
    toast.error("GST details not found or API error.");
}
  
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled", err.message);
        } else {
          console.log("error",err)
        }
      } 
    };
  const handleSearch = async () => {
    if (!gstNumber.trim()) {
      toast.error("Please enter a GST number");
      return;
    }

    if (!validateGST(gstNumber)) {
      toast.error("Invalid GST format. Example: 22ABCDE1234F1Z5");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    // Simulating API call
    setTimeout(() => {
      searchByGST();
      // setResults({
      //   gstin: gstNumber.toUpperCase(),
      //   legal_name: "ABC Technologies Pvt. Ltd.",
      //   trade_name: "ABC Tech Solutions",
      //   registration_date: "01-07-2017",
      //   status: "Active",
      //   state: "Maharashtra",
      //   business_type: "Private Limited Company",
      //   principal_place: "Mumbai, Maharashtra - 400001",
      //   additional_places: "2",
      //   last_return_filed: "December 2023",
      // });
      setLoading(false);
      toast.success("GST details retrieved successfully!");
    }, 1500);
  };
//  useEffect(() => {
//   console.log("test1")
//       searchByGST()
    
//   }, []);
  const handleImageUpload = (file, preview) => {
    if (file) {
      toast.info("Image uploaded! Processing GST certificate...");
      // Simulate OCR extraction
      setTimeout(() => {
        setGstNumber("22ABCDE1234F1Z5");
        toast.success("GST number extracted from image!");
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">GST Verification</h1>
        <p className="text-muted-foreground mt-2">
          Lookup GST registration details and business information
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manual Search */}
        <SearchCard>
          <SearchCardHeader
            icon={Search}
            title="Search by GSTIN"
            description="Enter the 15-character GST number"
          />
          <SearchCardContent>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  GST Number (GSTIN)
                </label>
                <input
                  type="text"
                  value={gstNumber}
                  onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                  placeholder="22ABCDE1234F1Z5"
                  maxLength={15}
                  className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl gradient-primary text-primary-foreground font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Search size={18} />
                Search GST
              </button>
            </div>
          </SearchCardContent>
        </SearchCard>

        {/* Image Upload */}
        <SearchCard>
          <SearchCardHeader
            icon={Building2}
            title="Upload GST Certificate"
            description="Extract GST details from certificate image"
          />
          <SearchCardContent>
            <ImageUploader
              onImageSelect={handleImageUpload}
              label="Upload GST Certificate"
              accept="image/*"
            />
          </SearchCardContent>
        </SearchCard>
      </div>

      {/* Results */}
      <SearchCard className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <SearchCardHeader
          icon={Building2}
          title="Search Results"
          description="GST verification details will appear here"
        />
        <ResultsDisplay data={results} loading={loading} error={error} type="GST" />
        {!results && !loading && !error && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <Building2 className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter a GST number or upload a certificate to get started
            </p>
          </div>
        )}
      </SearchCard>

      {/* Info Cards */}
      {results && (
        <div className="grid sm:grid-cols-2 gap-4 animate-slide-up">
          <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Principal Place</p>
              <p className="text-sm font-medium text-foreground">{results.principal_place}</p>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-card border border-border flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Registration Date</p>
              <p className="text-sm font-medium text-foreground">{results.registration_date}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GSTSearch;
