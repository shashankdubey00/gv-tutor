import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";

export default function LegacyJobRedirect() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  useEffect(() => {
    if (!jobId) {
      navigate("/apply-tutor", { replace: true });
      return;
    }

    navigate(`/apply-tutor?requestId=${encodeURIComponent(jobId)}`, { replace: true });
  }, [jobId, navigate]);

  return <LoadingSpinner />;
}

