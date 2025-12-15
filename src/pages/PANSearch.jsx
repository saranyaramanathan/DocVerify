import { useState } from "react";
import { CreditCard, Search, Sparkles } from "lucide-react";
import { SearchCard, SearchCardHeader, SearchCardContent } from "../components/SearchCard";
import ImageUploader from "../components/ImageUploader";
import ResultsDisplay from "../components/ResultsDisplay";
import { toast } from "sonner";

const PANSearch = () => {
  const [panNumber, setPanNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

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

    // Simulating API call
    setTimeout(() => {
      setResults({
        pan_number: panNumber.toUpperCase(),
        name: "John Doe",
        father_name: "Richard Doe",
        date_of_birth: "15-08-1990",
        status: "Active",
        last_updated: "2024-01-15",
        aadhaar_linked: "Yes",
      });
      setLoading(false);
      toast.success("PAN details retrieved successfully!");
    }, 1500);
  };

  const handleImageUpload = (file, preview) => {
    setUploadedImage(preview);
    if (file) {
      toast.info("Image uploaded! Processing with OCR...");
      // Simulate OCR extraction
      setTimeout(() => {
        setPanNumber("ABCDE1234F");
        toast.success("PAN number extracted from image!");
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">PAN Verification</h1>
        <p className="text-muted-foreground mt-2">
          Search PAN details by number or upload an image for automatic extraction
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Manual Search */}
        <SearchCard>
          <SearchCardHeader
            icon={Search}
            title="Search by PAN Number"
            description="Enter the 10-character PAN number"
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
                Search PAN
              </button>
            </div>
          </SearchCardContent>
        </SearchCard>

        {/* Image Upload */}
        <SearchCard>
          <SearchCardHeader
            icon={Sparkles}
            title="Upload PAN Card Image"
            description="Extract PAN details using OCR technology"
          />
          <SearchCardContent>
            <ImageUploader
              onImageSelect={handleImageUpload}
              label="Upload PAN Card"
              accept="image/*"
            />
          </SearchCardContent>
        </SearchCard>
      </div>

      {/* Results */}
      <SearchCard className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <SearchCardHeader
          icon={CreditCard}
          title="Search Results"
          description="PAN verification details will appear here"
        />
        <ResultsDisplay data={results} loading={loading} error={error} type="PAN" />
        {!results && !loading && !error && (
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Enter a PAN number or upload an image to get started
            </p>
          </div>
        )}
      </SearchCard>
    </div>
  );
};

export default PANSearch;
