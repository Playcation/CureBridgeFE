import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {getOrganizationInfo} from "../../../api/MemberApi";
import {selectCurrentUserId} from "../../../store/slices/authSlice";
import "./OrgAdminMyPage.css";


interface OrganizationInfo {
  orgName:string;
  orgNumber:string;
  ownerName:string;
  ownerNumber:string;
  orgAddress:string;
}

function OrgAdminMyPage() {
  const [organizationInfo, setOrganizationInfo] = useState<OrganizationInfo | null>(null);
  const userId = useSelector(selectCurrentUserId);

  useEffect(() => {
    const fetchOrganizationInfo = async () => {
        try {
          const response = await getOrganizationInfo();
          setOrganizationInfo(response.data);
        } catch (error) {
          console.error("Failed to fetch organization info:", error);
        }
    };

    fetchOrganizationInfo();
  }, [userId]);

  return (
      <div className="org-admin-container">
        <div className="org-admin-content">
          <h1 className="org-admin-title">
            마이페이지
          </h1>
          <div className="org-admin-paper">
            {organizationInfo ? (
                <div>
                  <h6 className="org-admin-info-item">
                    회사명: {organizationInfo.orgName}
                  </h6>
                  <h6 className="org-admin-info-item">
                    회사 전화번호: {organizationInfo.orgNumber}
                  </h6>
                  <h6 className="org-admin-info-item">
                    대표자명: {organizationInfo.ownerName}
                  </h6>
                  <h6 className="org-admin-info-item">
                    대표자 연락처: {organizationInfo.ownerNumber}
                  </h6>
                  <h6 className="org-admin-info-item">
                    주소: {organizationInfo.orgAddress}
                  </h6>
        </div>
            ) : (
                <p>
                  회사 정보를 불러오는 중입니다...
                </p>
            )}
          </div>
        </div>
      </div>
  );
}

export default OrgAdminMyPage;
