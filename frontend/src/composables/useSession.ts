import { ref, watch } from "vue";
import {
  generateAnimalSessionId,
  generateSessionName,
} from "@/utils/userGenerator";
import { storage } from "@/utils/storage";
import { STORAGE_KEYS } from "@/lib/const";

const sessionId = ref<string>(
  storage.get<string>(STORAGE_KEYS.SESSION_ID) || generateAnimalSessionId()
);
const sessionName = ref<string>(
  storage.get<string>(STORAGE_KEYS.SESSION_NAME) || generateSessionName()
);

export function useSession() {
  const saveSessionId = (): void => {
    storage.set(STORAGE_KEYS.SESSION_ID, sessionId.value);
  };
  const saveSessionName = (): void => {
    storage.set(STORAGE_KEYS.SESSION_NAME, sessionName.value);
  };

  watch([sessionName], saveSessionName, { immediate: true });
  watch([sessionId], saveSessionId, { immediate: true });

  return {
    sessionId,
    sessionName,
  };
}
