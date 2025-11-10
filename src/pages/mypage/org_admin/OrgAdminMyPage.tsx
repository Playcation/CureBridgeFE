import { useEffect, useState } from "react";
import {useSelector} from "react-redux";
import {getOrganizationInfo} from "../../../api/Api";
import {selectCurrentUserId} from "../../../store/slices/authSlice";


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
      if (userId) {
        try {
          const response = await getOrganizationInfo(userId);
          setOrganizationInfo(response.data);
        } catch (error) {
          console.error("Failed to fetch organization info:", error);
        }
      }
    };

    fetchOrganizationInfo();
  }, [userId]);

  return (
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        <div style={{marginTop: '32px', marginBottom: '32px'}}>
          <h1 style={{ marginBottom: '0.35em' }}>
            마이페이지
          </h1>
          <div style={{ padding: '32px', boxShadow: '0px 3px 3px -2px rgba(0,0,0,0.2), 0px 3px 4px 0px rgba(0,0,0,0.14), 0px 1px 8px 0px rgba(0,0,0,0.12)' }}>
            {organizationInfo ? (
                <div>
                  <h6 style={{ marginBottom: '0.35em' }}>
                    회사명: {organizationInfo.orgName}
                  </h6>
                  <h6 style={{ marginBottom: '0.35em' }}>
                    회사 전화번호: {organizationInfo.orgNumber}
                  </h6>
                  <h6 style={{ marginBottom: '0.35em' }}>
                    대표자명: {organizationInfo.ownerName}
                  </h6>
                  <h6 style={{ marginBottom: '0.35em' }}>
                    대표자 연락처: {organizationInfo.ownerNumber}
                  </h6>
                  <h6 style={{ marginBottom: '0.35em' }}>
                    주소: {organizationInfo.orgAddress}
                  </h6>
        </div>
            ) : (
                <p>
                  회사 정보를 불러오는 중입니다...
                </p>
            )}
          </div>
                        </div>      </div>
  );
}

export default OrgAdminMyPage;
