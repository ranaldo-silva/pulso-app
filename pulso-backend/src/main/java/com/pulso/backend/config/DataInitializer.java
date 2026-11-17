package com.pulso.backend.config;

import com.pulso.backend.domain.model.Channel;
import com.pulso.backend.domain.model.User;
import com.pulso.backend.domain.model.UserStatus;
import com.pulso.backend.domain.repository.ChannelRepository;
import com.pulso.backend.domain.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    @Bean
    public CommandLineRunner initData(
            UserRepository userRepository,
            ChannelRepository channelRepository,
            PasswordEncoder passwordEncoder
    ) {
        return args -> {
            if (userRepository.count() == 0) {
                log.info("Inicializando dados de demonstração do PULSO...");

                User ronaldo = new User("ronaldo", "Ronaldo Silva", "ronaldo@pulso.com", passwordEncoder.encode("1234"));
                ronaldo.setStatus(UserStatus.ONLINE);
                userRepository.save(ronaldo);

                User joao = new User("joao", "João", "joao@pulso.com", passwordEncoder.encode("1234"));
                joao.setStatus(UserStatus.ONLINE);
                userRepository.save(joao);

                User carlos = new User("carlos", "Carlos", "carlos@pulso.com", passwordEncoder.encode("1234"));
                carlos.setStatus(UserStatus.ONLINE);
                userRepository.save(carlos);

                User pedro = new User("pedro", "Pedro", "pedro@pulso.com", passwordEncoder.encode("1234"));
                pedro.setStatus(UserStatus.OFFLINE);
                userRepository.save(pedro);

                User maria = new User("maria", "Maria", "maria@pulso.com", passwordEncoder.encode("1234"));
                maria.setStatus(UserStatus.AWAY);
                userRepository.save(maria);

                User ana = new User("ana", "Ana", "ana@pulso.com", passwordEncoder.encode("1234"));
                ana.setStatus(UserStatus.BUSY);
                userRepository.save(ana);

                log.info("Usuários criados com sucesso! (Senha padrão: 1234)");

                // Default Channels
                Channel c1 = new Channel("equipe-operacional", "Equipe Operacional", "Comunicação da equipe", "ronaldo");
                c1.setIcon("radio-outline");
                c1.getMembers().add("joao");
                c1.getMembers().add("carlos");
                c1.getMembers().add("pedro");
                channelRepository.save(c1);

                Channel c2 = new Channel("familia", "Família", "Canal privado da família", "ronaldo");
                c2.setIcon("people-outline");
                c2.getMembers().add("maria");
                c2.getMembers().add("ana");
                channelRepository.save(c2);

                Channel c3 = new Channel("seguranca", "Segurança", "Canal da equipe de segurança", "carlos");
                c3.setIcon("shield-outline");
                c3.getMembers().add("ronaldo");
                c3.getMembers().add("pedro");
                channelRepository.save(c3);

                log.info("Canais padrão inicializados com sucesso!");
            }
        };
    }
}
