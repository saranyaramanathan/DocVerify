import { useState } from "react";
import { FileText, Upload, TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SearchCard, SearchCardHeader, SearchCardContent } from "../components/SearchCard";
import ImageUploader from "../components/ImageUploader";
import { toast } from "sonner";
import { cn } from "../lib/utils";

const BankStatement = () => {
  const [loading, setLoading] = useState(false);
  const [statementData, setStatementData] = useState(null);

  const handleImageUpload = (file, preview) => {
    if (file) {
      setLoading(true);
      toast.info("Processing bank statement...");

      // Simulate OCR processing
      setTimeout(() => {
        setStatementData({
          bank_name: "State Bank of India",
          account_number: "XXXX XXXX 4567",
          account_holder: "John Doe",
          statement_period: "01 Dec 2023 - 31 Dec 2023",
          opening_balance: "₹45,230.50",
          closing_balance: "₹62,845.75",
          total_credits: "₹85,000.00",
          total_debits: "₹67,384.75",
          transactions: [
            { date: "05 Dec", description: "Salary Credit", amount: "+₹65,000.00", type: "credit" },
            { date: "08 Dec", description: "Online Shopping", amount: "-₹4,599.00", type: "debit" },
            { date: "12 Dec", description: "UPI Transfer", amount: "-₹15,000.00", type: "debit" },
            { date: "15 Dec", description: "Freelance Payment", amount: "+₹20,000.00", type: "credit" },
            { date: "20 Dec", description: "Utility Bill", amount: "-₹3,250.00", type: "debit" },
            { date: "25 Dec", description: "ATM Withdrawal", amount: "-₹10,000.00", type: "debit" },
            { date: "28 Dec", description: "EMI Payment", amount: "-₹12,500.00", type: "debit" },
          ],
        });
        setLoading(false);
        toast.success("Bank statement analyzed successfully!");
      }, 2500);
    } else {
      setStatementData(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-12 lg:pt-0">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Bank Statement Reader</h1>
        <p className="text-muted-foreground mt-2">
          Upload a bank statement image to extract and analyze transaction data
        </p>
      </div>

      {/* Upload Section */}
      <SearchCard>
        <SearchCardHeader
          icon={Upload}
          title="Upload Bank Statement"
          description="Supported formats: PNG, JPG, PDF screenshots"
        />
        <SearchCardContent>
          <ImageUploader
            onImageSelect={handleImageUpload}
            label="Upload Bank Statement"
            accept="image/*"
          />
        </SearchCardContent>
      </SearchCard>

      {/* Loading State */}
      {loading && (
        <SearchCard>
          <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin mb-6" />
            <p className="text-sm font-medium text-foreground">Analyzing statement...</p>
            <p className="text-xs text-muted-foreground mt-1">Extracting transaction data with OCR</p>
          </div>
        </SearchCard>
      )}

      {/* Results */}
      {statementData && !loading && (
        <>
          {/* Account Info */}
          <SearchCard className="animate-scale-in">
            <SearchCardHeader
              icon={FileText}
              title="Account Information"
              description={statementData.bank_name}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Account Holder</p>
                <p className="font-semibold text-foreground">{statementData.account_holder}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Account Number</p>
                <p className="font-semibold text-foreground">{statementData.account_number}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Statement Period</p>
                <p className="font-semibold text-foreground">{statementData.statement_period}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary/50">
                <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                <p className="font-semibold text-foreground">{statementData.bank_name}</p>
              </div>
            </div>
          </SearchCard>

          {/* Balance Summary */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-xl bg-card border border-border shadow-card animate-slide-up">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Opening Balance</span>
              </div>
              <p className="text-xl font-bold text-foreground">{statementData.opening_balance}</p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border shadow-card animate-slide-up" style={{ animationDelay: "0.05s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
                <span className="text-xs text-muted-foreground">Total Credits</span>
              </div>
              <p className="text-xl font-bold text-accent">{statementData.total_credits}</p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border shadow-card animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-destructive" />
                </div>
                <span className="text-xs text-muted-foreground">Total Debits</span>
              </div>
              <p className="text-xl font-bold text-destructive">{statementData.total_debits}</p>
            </div>

            <div className="p-5 rounded-xl bg-card border border-border shadow-card animate-slide-up" style={{ animationDelay: "0.15s" }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Wallet className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">Closing Balance</span>
              </div>
              <p className="text-xl font-bold text-foreground">{statementData.closing_balance}</p>
            </div>
          </div>

          {/* Transactions */}
          <SearchCard className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <SearchCardHeader
              icon={FileText}
              title="Transaction History"
              description="Recent transactions extracted from statement"
            />
            <div className="space-y-3">
              {statementData.transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        transaction.type === "credit" ? "bg-accent/10" : "bg-destructive/10"
                      )}
                    >
                      {transaction.type === "credit" ? (
                        <ArrowDownRight className="w-5 h-5 text-accent" />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground text-sm">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>
                  <p
                    className={cn(
                      "font-semibold",
                      transaction.type === "credit" ? "text-accent" : "text-destructive"
                    )}
                  >
                    {transaction.amount}
                  </p>
                </div>
              ))}
            </div>
          </SearchCard>
        </>
      )}

      {/* Empty State */}
      {!statementData && !loading && (
        <SearchCard>
          <div className="py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Upload a bank statement image to analyze transactions
            </p>
          </div>
        </SearchCard>
      )}
    </div>
  );
};

export default BankStatement;
